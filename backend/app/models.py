"""
Modelos de datos para la API
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class DatosResponse(BaseModel):
    """Respuesta con datos del Excel"""
    success: bool
    total: int
    columns: List[str]
    data: List[Dict[str, Any]]
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "total": 4,
                "columns": ["id", "nombre"],
                "data": [
                    {"id": 1, "nombre": "Juan"},
                    {"id": 2, "nombre": "María"},
                    {"id": 3, "nombre": "Carlos"},
                    {"id": 4, "nombre": "Ana"}
                ]
            }
        }


class ColumnasResponse(BaseModel):
    """Respuesta con columnas del Excel"""
    success: bool
    columns: List[str]
    data_types: Dict[str, str]
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "columns": ["id", "nombre"],
                "data_types": {
                    "id": "int64",
                    "nombre": "object"
                }
            }
        }


class FileUploadRequest(BaseModel):
    """Request para cargar archivo personalizado"""
    file_url: str = Field(..., description="URL del archivo en OneDrive")
    
    class Config:
        json_schema_extra = {
            "example": {
                "file_url": "https://1drv.ms/x/..."
            }
        }


class HealthResponse(BaseModel):
    """Respuesta de health check"""
    status: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy"
            }
        }


class ErrorResponse(BaseModel):
    """Respuesta de error"""
    detail: str
    status_code: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "detail": "Error message here",
                "status_code": 400
            }
        }
