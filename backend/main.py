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

EXCEL_SOURCE_URL = os.getenv("EXCEL_SOURCE_URL", "").strip()
EXCEL_SHEET_NAME = os.getenv("EXCEL_SHEET_NAME", "").strip() or None


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
    download_url = _url_descarga(EXCEL_SOURCE_URL)
    logger.info(f"Descargando Excel remoto: {download_url}")

    async with httpx.AsyncClient(follow_redirects=True) as client:
        response = await client.get(download_url, timeout=45.0)
        response.raise_for_status()

    excel_data = io.BytesIO(response.content)
    df = pd.read_excel(excel_data, sheet_name=EXCEL_SHEET_NAME)
    df.columns = [str(col).strip() for col in df.columns.tolist()]
    return df


def _validar_archivo(file: UploadFile) -> None:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No se recibio archivo.")

    nombre = file.filename.lower()
    if not (nombre.endswith(".xlsx") or nombre.endswith(".xls")):
        raise HTTPException(status_code=400, detail="El archivo debe ser Excel (.xlsx o .xls).")


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
        return {"status": "healthy", "storage": "remote_excel", "rows": len(df)}
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

        df_subido = pd.read_excel(io.BytesIO(contenido), sheet_name=EXCEL_SHEET_NAME)
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
        return {
            "success": True,
            "message": (
                "Cambios detectados y aplicados en la vista. Para escribirlos en Drive se requiere API del proveedor."
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
