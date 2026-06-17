"""
FastAPI backend para gestionar registros desde un Excel remoto.

Soporta URLs publicas de OneDrive, Google Drive y Google Sheets publicado.
La lectura funciona sin credenciales si el archivo tiene permisos de lectura.
La escritura directa requiere configurar la API del proveedor.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx
import pandas as pd
import io
import os
from typing import List, Dict, Any
import logging
import re
import base64
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Gestion de Eventos API",
    description="API para gestionar eventos e inscripciones desde Excel remoto",
    version="3.0.0",
)

origins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _normalizar_df(df: pd.DataFrame, columnas: List[str]) -> List[Dict[str, Any]]:
    resultado: List[Dict[str, Any]] = []
    for _, row in df.iterrows():
        registro: Dict[str, Any] = {}
        for col in columnas:
            valor = row.get(col)
            registro[col] = "" if pd.isna(valor) else str(valor).strip()
        resultado.append(registro)
    return resultado


def _url_descarga(url: str) -> str:
    if not url:
        raise HTTPException(status_code=500, detail="Falta EXCEL_SOURCE_URL en backend/.env.")

    if "1drv.ms" in url:
        return url.split("?")[0] + "?download=1"

    google_file = re.search(r"drive\.google\.com/file/d/([^/]+)", url)
    if google_file:
        file_id = google_file.group(1)
        return f"https://drive.google.com/uc?export=download&id={file_id}"

    google_open = re.search(r"drive\.google\.com/open\?id=([^&]+)", url)
    if google_open:
        file_id = google_open.group(1)
        return f"https://drive.google.com/uc?export=download&id={file_id}"

    google_sheet = re.search(r"docs\.google\.com/spreadsheets/d/([^/]+)", url)
    if google_sheet:
        sheet_id = google_sheet.group(1)
        return f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=xlsx"

    return url


async def _leer_excel_remoto() -> pd.DataFrame:
    excel_source_url = os.getenv("EXCEL_SOURCE_URL", "").strip()
    sheet_name = os.getenv("EXCEL_SHEET_NAME", "").strip() or None
    download_url = _url_descarga(excel_source_url)
    logger.info(f"Descargando Excel remoto: {download_url}")

    async with httpx.AsyncClient(follow_redirects=True) as client:
        response = await client.get(download_url, timeout=45.0)
        response.raise_for_status()

    excel_data = io.BytesIO(response.content)
    try:
        df = pd.read_excel(excel_data, sheet_name=sheet_name)
    except ValueError as e:
        if sheet_name and "Worksheet named" in str(e):
            logger.warning(f"No se encontro la hoja '{sheet_name}'. Leyendo la primera hoja.")
            excel_data.seek(0)
            df = pd.read_excel(excel_data)
        else:
            raise
    df.columns = [str(col).strip() for col in df.columns.tolist()]
    return df


def _validar_archivo(file: UploadFile) -> None:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No se recibio archivo.")

    nombre = file.filename.lower()
    if not (nombre.endswith(".xlsx") or nombre.endswith(".xls")):
        raise HTTPException(status_code=400, detail="El archivo debe ser Excel (.xlsx o .xls).")


def _crear_excel_bytes(registros: List[Dict[str, Any]], columnas: List[str]) -> bytes:
    output = io.BytesIO()
    df = pd.DataFrame(registros, columns=columnas)
    sheet_name = os.getenv("EXCEL_SHEET_NAME", "").strip() or "Registros"
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name=sheet_name[:31])
    output.seek(0)
    return output.read()


def _graph_share_id(url: str) -> str:
    encoded = base64.urlsafe_b64encode(url.encode("utf-8")).decode("utf-8").rstrip("=")
    return f"u!{encoded}"


async def _resolver_onedrive_item(access_token: str) -> tuple[str, str]:
    drive_id = os.getenv("ONEDRIVE_DRIVE_ID", "").strip()
    item_id = os.getenv("ONEDRIVE_ITEM_ID", "").strip()
    if drive_id and item_id:
        return drive_id, item_id

    source_url = os.getenv("EXCEL_SOURCE_URL", "").strip()
    if not source_url:
        raise HTTPException(status_code=500, detail="Falta EXCEL_SOURCE_URL para resolver el archivo de OneDrive.")

    share_id = _graph_share_id(source_url)
    headers = {"Authorization": f"Bearer {access_token}"}
    graph_url = f"https://graph.microsoft.com/v1.0/shares/{share_id}/driveItem"

    async with httpx.AsyncClient(follow_redirects=True) as client:
        response = await client.get(graph_url, headers=headers, timeout=45.0)

    if response.status_code >= 400:
        raise HTTPException(
            status_code=500,
            detail=f"No se pudo resolver el archivo en OneDrive con Microsoft Graph: {response.text}",
        )

    payload = response.json()
    parent = payload.get("parentReference", {})
    resolved_drive_id = parent.get("driveId")
    resolved_item_id = payload.get("id")
    if not resolved_drive_id or not resolved_item_id:
        raise HTTPException(status_code=500, detail="Microsoft Graph no devolvio driveId/itemId del archivo.")
    return resolved_drive_id, resolved_item_id


async def _guardar_excel_onedrive(registros: List[Dict[str, Any]], columnas: List[str]) -> None:
    access_token = os.getenv("ONEDRIVE_ACCESS_TOKEN", "").strip()
    if not access_token:
        raise HTTPException(
            status_code=500,
            detail=(
                "No se guardo en OneDrive porque falta ONEDRIVE_ACCESS_TOKEN. "
                "Se requiere un token delegado de Microsoft Graph con permiso Files.ReadWrite."
            ),
        )

    drive_id, item_id = await _resolver_onedrive_item(access_token)
    excel_bytes = _crear_excel_bytes(registros, columnas)
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
    graph_url = f"https://graph.microsoft.com/v1.0/drives/{drive_id}/items/{item_id}/content"

    async with httpx.AsyncClient(follow_redirects=True) as client:
        response = await client.put(graph_url, headers=headers, content=excel_bytes, timeout=60.0)

    if response.status_code >= 400:
        raise HTTPException(
            status_code=500,
            detail=f"No se pudo guardar el Excel en OneDrive con Microsoft Graph: {response.text}",
        )


@app.get("/")
async def root():
    return {
        "message": "Gestion de Eventos API",
        "version": "3.0.0",
        "storage": "remote_excel",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    try:
        df = await _leer_excel_remoto()
        return {
            "status": "healthy",
            "storage": "remote_excel",
            "rows": len(df),
            "onedrive_write_ready": bool(os.getenv("ONEDRIVE_ACCESS_TOKEN", "").strip()),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Excel remoto no disponible: {str(e)}")


@app.get("/api/datos")
async def obtener_datos():
    try:
        df = await _leer_excel_remoto()
        columnas = df.columns.tolist()
        datos = _normalizar_df(df, columnas)
        return {
            "success": True,
            "total": len(datos),
            "columns": columnas,
            "data": datos,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener datos del Excel remoto: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al obtener datos: {str(e)}")


@app.get("/api/datos/excel")
async def descargar_datos_excel():
    try:
        df = await _leer_excel_remoto()
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name="Registros")
        output.seek(0)
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": 'attachment; filename="registros_excel_remoto.xlsx"'},
        )
    except Exception as e:
        logger.error(f"Error al exportar datos: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al exportar datos: {str(e)}")


@app.post("/api/datos/upload-excel")
async def cargar_excel_diferencial(file: UploadFile = File(...)):
    try:
        _validar_archivo(file)

        contenido = await file.read()
        if not contenido:
            raise HTTPException(status_code=400, detail="El archivo Excel esta vacio.")

        df_base = await _leer_excel_remoto()
        columnas_base = df_base.columns.tolist()
        base_norm = _normalizar_df(df_base, columnas_base)

        sheet_name = os.getenv("EXCEL_SHEET_NAME", "").strip() or None
        try:
            df_subido = pd.read_excel(io.BytesIO(contenido), sheet_name=sheet_name)
        except ValueError as e:
            if sheet_name and "Worksheet named" in str(e):
                df_subido = pd.read_excel(io.BytesIO(contenido))
            else:
                raise
        df_subido.columns = [str(col).strip() for col in df_subido.columns.tolist()]
        columnas_subidas = df_subido.columns.tolist()

        if columnas_subidas != columnas_base:
            raise HTTPException(
                status_code=400,
                detail=(
                    "El formato del archivo no coincide con el Excel base. "
                    f"Columnas esperadas: {columnas_base}. "
                    f"Columnas recibidas: {columnas_subidas}."
                ),
            )

        subido_norm = _normalizar_df(df_subido, columnas_base)
        key_col = columnas_base[0]
        base_map = {row.get(key_col, ""): row for row in base_norm if row.get(key_col, "") != ""}
        subido_map = {row.get(key_col, ""): row for row in subido_norm if row.get(key_col, "") != ""}

        merged_map = dict(base_map)
        insertados = 0
        actualizados = 0
        sin_cambios = 0

        for key, row_subido in subido_map.items():
            row_base = base_map.get(key)
            if row_base is None:
                merged_map[key] = row_subido
                insertados += 1
            elif row_base != row_subido:
                merged_map[key] = row_subido
                actualizados += 1
            else:
                sin_cambios += 1

        datos_actualizados = list(merged_map.values())
        cambios_detectados = insertados + actualizados
        if cambios_detectados > 0:
            await _guardar_excel_onedrive(datos_actualizados, columnas_base)

        return {
            "success": True,
            "message": (
                "Cambios guardados en el archivo de OneDrive."
                if cambios_detectados > 0
                else "No se detectaron cambios respecto al Excel base."
            ),
            "columns": columnas_base,
            "summary": {
                "total_mongodb": len(base_norm),
                "total_subido": len(subido_norm),
                "insertados": insertados,
                "actualizados": actualizados,
                "sin_cambios": sin_cambios,
                "diferentes": cambios_detectados,
            },
            "data": datos_actualizados,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al cargar Excel diferencial: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error al procesar archivo: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
