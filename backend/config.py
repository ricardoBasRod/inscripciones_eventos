"""
Configuración de la aplicación FastAPI
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Configuración de la aplicación
    
    Las variables pueden venir de:
    1. Archivo .env
    2. Variables de entorno del sistema
    3. Valores por defecto
    """
    
    # OneDrive
    onedrive_url: str = "https://1drv.ms/x/c/b19f31b2afda8ba0/IQCxNEN3UmXBQLI_rl5VESYZAQqLNYWhB5ipHNjRt0Wprbs?e=oCO30X"
    
    # FastAPI
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000
    
    # CORS
    frontend_url: str = "http://localhost:4200"
    allowed_origins: list = [
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://localhost:3000",
    ]
    
    # API
    api_title: str = "Gestión de Eventos API"
    api_version: str = "1.0.0"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Instancia global de configuración
settings = Settings()
