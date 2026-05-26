"""
FastAPI backend para gestion de eventos usando MongoDB Atlas.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pymongo import MongoClient
import pandas as pd
import io
import os
from typing import List, Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Gestion de Eventos API",
    description="API para gestionar eventos e inscripciones",
    version="2.0.0",
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

MONGODB_URI = os.getenv("MONGODB_URI", "").strip()
MONGODB_DB = os.getenv("MONGODB_DB", "gestion_eventos").strip()
MONGODB_COLLECTION = os.getenv("MONGODB_COLLECTION", "inscripciones").strip()

mongo_client: MongoClient | None = None


def _normalizar_df(df: pd.DataFrame, columnas: List[str]) -> List[Dict[str, Any]]:
    resultado: List[Dict[str, Any]] = []
    for _, row in df.iterrows():
        registro: Dict[str, Any] = {}
        for col in columnas:
            valor = row.get(col)
            if pd.isna(valor):
                registro[col] = ""
            else:
                registro[col] = str(valor).strip()
        resultado.append(registro)
    return resultado


def _obtener_collection():
    global mongo_client
    if not MONGODB_URI:
        raise HTTPException(
            status_code=500,
            detail="Falta MONGODB_URI en variables de entorno."
        )

    if mongo_client is None:
        mongo_client = MongoClient(MONGODB_URI)

    db = mongo_client[MONGODB_DB]
    return db[MONGODB_COLLECTION]


def _leer_todos() -> List[Dict[str, Any]]:
    collection = _obtener_collection()
    docs = list(collection.find({}, {"_id": 0}))
    return docs


@app.get("/")
async def root():
    return {
        "message": "Gestion de Eventos API",
        "version": "2.0.0",
        "storage": "mongodb",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    try:
        collection = _obtener_collection()
        collection.estimated_document_count()
        return {"status": "healthy", "storage": "mongodb"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MongoDB no disponible: {str(e)}")


@app.get("/api/datos")
async def obtener_datos():
    try:
        datos = _leer_todos()
        columnas = list(datos[0].keys()) if datos else []
        return {
            "success": True,
            "total": len(datos),
            "columns": columnas,
            "data": datos,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener datos de MongoDB: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al obtener datos: {str(e)}")


@app.get("/api/datos/excel")
async def descargar_datos_excel():
    try:
        datos = _leer_todos()
        df = pd.DataFrame(datos)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name="Registros")
        output.seek(0)
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": 'attachment; filename="registros_mongodb.xlsx"'},
        )
    except Exception as e:
        logger.error(f"Error al exportar datos: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al exportar datos: {str(e)}")


@app.post("/api/datos/upload-excel")
async def cargar_excel_diferencial(file: UploadFile = File(...)):
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No se recibio archivo.")

        nombre = file.filename.lower()
        if not (nombre.endswith(".xlsx") or nombre.endswith(".xls")):
            raise HTTPException(status_code=400, detail="El archivo debe ser Excel (.xlsx o .xls).")

        contenido = await file.read()
        if not contenido:
            raise HTTPException(status_code=400, detail="El archivo Excel esta vacio.")

        df_subido = pd.read_excel(io.BytesIO(contenido))
        if len(df_subido.columns) == 0:
            raise HTTPException(status_code=400, detail="No se encontraron columnas en el archivo.")

        columnas_subidas = [str(col).strip() for col in df_subido.columns.tolist()]
        subido_norm = _normalizar_df(df_subido, columnas_subidas)

        collection = _obtener_collection()
        base_docs = _leer_todos()

        if not base_docs:
            if subido_norm:
                collection.insert_many(subido_norm)
            return {
                "success": True,
                "message": "Base inicializada desde archivo Excel.",
                "columns": columnas_subidas,
                "summary": {
                    "total_mongodb": 0,
                    "total_subido": len(subido_norm),
                    "insertados": len(subido_norm),
                    "actualizados": 0,
                    "sin_cambios": 0,
                },
                "data": subido_norm,
            }

        columnas_base = list(base_docs[0].keys())
        if columnas_subidas != columnas_base:
            raise HTTPException(
                status_code=400,
                detail=(
                    "El formato del archivo no coincide con el formato actual de la base de datos. "
                    f"Columnas esperadas: {columnas_base}. "
                    f"Columnas recibidas: {columnas_subidas}."
                ),
            )

        base_norm = [{col: str(doc.get(col, "")).strip() for col in columnas_base} for doc in base_docs]
        key_col = columnas_base[0]

        base_map = {row.get(key_col, ""): row for row in base_norm if row.get(key_col, "") != ""}
        subido_map = {row.get(key_col, ""): row for row in subido_norm if row.get(key_col, "") != ""}

        insertados = 0
        actualizados = 0
        sin_cambios = 0

        for key, row_subido in subido_map.items():
            row_base = base_map.get(key)
            if row_base is None:
                collection.insert_one(row_subido)
                insertados += 1
            elif row_base != row_subido:
                collection.update_one({key_col: key}, {"$set": row_subido})
                actualizados += 1
            else:
                sin_cambios += 1

        datos_actualizados = _leer_todos()
        cambios_detectados = insertados + actualizados
        return {
            "success": True,
            "message": (
                "Carga diferencial aplicada sobre MongoDB."
                if cambios_detectados > 0
                else "No se detectaron cambios respecto a la base actual."
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
