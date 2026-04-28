"""
FastAPI Backend for Gestión de Eventos
Descarga datos de Excel desde OneDrive y los sirve via API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
import httpx
import pandas as pd
import io
import os
from typing import List, Dict, Any
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Crear aplicación FastAPI
app = FastAPI(
    title="Gestión de Eventos API",
    description="API para gestionar eventos e inscripciones",
    version="1.0.0"
)

# Configurar CORS para que funcione con el frontend de Angular
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

# Configuración
ONEDRIVE_URL = os.getenv(
    "ONEDRIVE_URL",
    "https://1drv.ms/x/c/b19f31b2afda8ba0/IQCxNEN3UmXBQLI_rl5VESYZAQqLNYWhB5ipHNjRt0Wprbs?e=oCO30X"
)


@app.get("/")
async def root():
    """Endpoint raíz"""
    return {
        "message": "Gestión de Eventos API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/api/datos")
async def obtener_datos():
    """
    Obtiene los datos del archivo Excel de OneDrive
    
    Returns:
        List[Dict]: Lista de registros del Excel
    """
    try:
        # Convertir la URL compartida de OneDrive a URL de descarga directa
        download_url = _convertir_url_onedrive(ONEDRIVE_URL)
        
        logger.info(f"Descargando datos de OneDrive: {download_url}")
        
        # Descargar el archivo
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(download_url, timeout=30.0)
            response.raise_for_status()
        
        # Leer el Excel
        excel_data = io.BytesIO(response.content)
        df = pd.read_excel(excel_data)
        
        # Convertir a lista de diccionarios
        datos = df.to_dict(orient='records')
        
        logger.info(f"Se obtuvieron {len(datos)} registros")
        
        return {
            "success": True,
            "total": len(datos),
            "columns": df.columns.tolist(),
            "data": datos
        }
        
    except Exception as e:
        logger.error(f"Error al obtener datos: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al descargar datos: {str(e)}"
        )


@app.get("/api/datos/excel")
async def descargar_datos_excel():
    """Descarga los datos de OneDrive en formato Excel."""
    try:
        download_url = _convertir_url_onedrive(ONEDRIVE_URL)
        logger.info(f"Descargando datos para exportacion: {download_url}")

        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(download_url, timeout=30.0)
            response.raise_for_status()

        excel_data = io.BytesIO(response.content)
        df = pd.read_excel(excel_data)

        output = io.BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name="Registros")
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": 'attachment; filename="registros_eventos.xlsx"'}
        )
    except Exception as e:
        logger.error(f"Error al exportar datos: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al exportar datos: {str(e)}"
        )


@app.post("/api/datos/upload")
async def cargar_datos_personalizados(file_url: str):
    """
    Carga datos desde una URL de OneDrive personalizada
    
    Args:
        file_url: URL del archivo en OneDrive
        
    Returns:
        Dict con los datos procesados
    """
    try:
        download_url = _convertir_url_onedrive(file_url)
        
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(download_url, timeout=30.0)
            response.raise_for_status()
        
        excel_data = io.BytesIO(response.content)
        df = pd.read_excel(excel_data)
        datos = df.to_dict(orient='records')
        
        return {
            "success": True,
            "total": len(datos),
            "columns": df.columns.tolist(),
            "data": datos
        }
        
    except Exception as e:
        logger.error(f"Error al cargar datos personalizados: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Error al procesar archivo: {str(e)}"
        )


def _convertir_url_onedrive(url: str) -> str:
    """
    Convierte una URL compartida de OneDrive a URL de descarga directa
    
    Args:
        url: URL compartida de OneDrive
        
    Returns:
        str: URL de descarga directa
    """
    # Ejemplo: https://1drv.ms/x/c/...?e=xxxxx
    # Convertir a: https://1drv.ms/download?resid=...&authkey=...
    
    if "1drv.ms" not in url:
        raise ValueError("URL no es válida de OneDrive")
    
    # Método alternativo: agregar ?download=1 al final
    if "?" in url:
        return url.split("?")[0] + "?download=1"
    else:
        return url + "?download=1"


@app.get("/api/columnas")
async def obtener_columnas():
    """Obtiene solo las columnas del archivo Excel"""
    try:
        download_url = _convertir_url_onedrive(ONEDRIVE_URL)
        
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(download_url, timeout=30.0)
            response.raise_for_status()
        
        excel_data = io.BytesIO(response.content)
        df = pd.read_excel(excel_data)
        
        return {
            "success": True,
            "columns": df.columns.tolist(),
            "data_types": df.dtypes.astype(str).to_dict()
        }
        
    except Exception as e:
        logger.error(f"Error al obtener columnas: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
