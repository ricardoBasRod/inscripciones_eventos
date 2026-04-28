"""
Funciones auxiliares para el backend
"""

import logging
from typing import Optional

logger = logging.getLogger(__name__)


def convertir_url_onedrive(url: str) -> str:
    """
    Convierte una URL compartida de OneDrive a URL de descarga directa
    
    Args:
        url: URL compartida de OneDrive (ej: https://1drv.ms/x/c/...)
        
    Returns:
        str: URL de descarga directa del archivo
        
    Raises:
        ValueError: Si la URL no es válida
        
    Ejemplos:
        >>> url = "https://1drv.ms/x/c/xxxxx?e=yyyy"
        >>> convertir_url_onedrive(url)
        'https://1drv.ms/x/c/xxxxx?download=1'
    """
    if not url or "1drv.ms" not in url:
        raise ValueError("URL no es válida de OneDrive")
    
    try:
        # Método 1: Si la URL tiene parámetros, extraer la parte base
        if "?" in url:
            base_url = url.split("?")[0]
            return base_url + "?download=1"
        else:
            # Método 2: Si no tiene parámetros, agregar directamente
            return url + "?download=1"
    except Exception as e:
        logger.error(f"Error al convertir URL: {str(e)}")
        raise ValueError(f"No se pudo procesar la URL: {str(e)}")


def validar_url_excel(url: str) -> bool:
    """
    Valida que una URL sea de OneDrive y sea un archivo Excel
    
    Args:
        url: URL a validar
        
    Returns:
        bool: True si es válida, False en caso contrario
    """
    valid_extensions = [".xlsx", ".xls", ".csv"]
    
    if not url or "1drv.ms" not in url:
        return False
    
    # Verificar que sea Excel o CSV
    url_lower = url.lower()
    return any(url_lower.endswith(ext) or ext in url_lower for ext in valid_extensions)


def log_request(method: str, path: str, status_code: int):
    """
    Registra información de una solicitud
    
    Args:
        method: Método HTTP (GET, POST, etc.)
        path: Ruta del endpoint
        status_code: Código de respuesta HTTP
    """
    logger.info(f"{method} {path} - Status: {status_code}")


def log_error(error_message: str, exception: Optional[Exception] = None):
    """
    Registra un error
    
    Args:
        error_message: Mensaje del error
        exception: Excepción original (opcional)
    """
    if exception:
        logger.error(f"{error_message}: {str(exception)}")
    else:
        logger.error(error_message)
