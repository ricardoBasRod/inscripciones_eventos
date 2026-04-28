# 🔧 Backend - FastAPI

API REST para gestionar y servir datos de Excel desde OneDrive.

## 📋 Requisitos Previos

- Python 3.9 o superior
- pip (gestor de paquetes de Python)

## 🚀 Instalación

### 1. Crear entorno virtual

**En Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**En Mac/Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tu URL de OneDrive
```

## 🎮 Ejecutar la API

```bash
python main.py
```

O usando uvicorn directamente:

```bash
uvicorn main:app --reload
```

**Acceso:**
- API: http://localhost:8000
- Documentación interactiva: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📚 Endpoints Disponibles

### 1. Health Check
```http
GET /health
```
Respuesta: `{"status": "healthy"}`

### 2. Obtener Datos
```http
GET /api/datos
```
Descarga el archivo Excel de OneDrive y retorna los datos en JSON.

**Respuesta:**
```json
{
  "success": true,
  "total": 4,
  "columns": ["id", "nombre"],
  "data": [
    {"id": 1, "nombre": "Juan"},
    {"id": 2, "nombre": "María"},
    {"id": 3, "nombre": "Carlos"},
    {"id": 4, "nombre": "Ana"}
  ]
}
```

### 3. Obtener Solo Columnas
```http
GET /api/columnas
```
Retorna la estructura del archivo sin los datos.

**Respuesta:**
```json
{
  "success": true,
  "columns": ["id", "nombre"],
  "data_types": {
    "id": "int64",
    "nombre": "object"
  }
}
```

### 4. Cargar Datos Personalizados
```http
POST /api/datos/upload
Content-Type: application/json

{
  "file_url": "https://1drv.ms/x/..."
}
```

## 🔗 Obtener URL Compartida de OneDrive

### Paso 1: Subir archivo a OneDrive
1. Ve a https://onedrive.live.com
2. Sube tu archivo Excel

### Paso 2: Compartir el archivo
1. Click derecho en el archivo
2. Selecciona "Compartir"
3. Copia el enlace de "Acceso a cualquiera"

### Paso 3: Configurar en el Backend
1. Copia el enlace en tu `.env`:
```
ONEDRIVE_URL=https://1drv.ms/x/...
```

## 🧪 Probar la API

### Usando cURL
```bash
# Verificar que el API está activo
curl http://localhost:8000/health

# Obtener datos
curl http://localhost:8000/api/datos

# Obtener solo columnas
curl http://localhost:8000/api/columnas
```

### Usando Postman
1. Descarga [Postman](https://www.postman.com/downloads/)
2. Importa los endpoints mencionados arriba
3. Prueba cada uno

### Usando la interfaz Swagger
1. Abre http://localhost:8000/docs
2. Todos los endpoints están documentados
3. Haz clic en "Try it out" para probar

## 📊 Estructura del Proyecto

```
backend/
├── main.py              # Archivo principal de FastAPI
├── requirements.txt     # Dependencias de Python
├── .env.example         # Variables de entorno ejemplo
├── .env                 # Variables de entorno (no compartir)
├── app/
│   ├── __init__.py
│   ├── models.py        # Modelos de datos (opcional)
│   ├── services.py      # Lógica de negocio (opcional)
│   └── utils.py         # Funciones auxiliares (opcional)
└── README.md            # Este archivo
```

## 🔐 Seguridad

### Variables Sensibles
- No compartir `.env` (incluido en .gitignore)
- Usar `.env.example` como plantilla
- En producción, usar variables de entorno del servidor

### CORS
- Frontend permitido en `http://localhost:4200`
- En producción, configurar dominio específico

## 🐛 Troubleshooting

### Error: "ModuleNotFoundError: No module named 'fastapi'"
```bash
# Asegúrate de que el venv está activado
pip install -r requirements.txt
```

### Error: "Connection refused"
- Verifica que el API está corriendo: `python main.py`
- Verifica el puerto 8000 no esté en uso

### Error: "SSL certificate verify failed"
- En desarrollo: Usar URLs sin HTTPS
- En producción: Configurar certificados correctamente

### Archivo Excel no se descarga
- Verificar que la URL de OneDrive es correcta
- Asegurar que el archivo está compartido públicamente
- Ver los logs: `uvicorn main:app --reload --log-level debug`

## 📦 Agregar Nuevas Dependencias

```bash
pip install nombre-del-paquete
pip freeze > requirements.txt
```

## 🚀 Despliegue en Producción

### Opción 1: Azure App Service
```bash
# Instalar Azure CLI
# Crear recurso en Azure
az webapp up --name mi-api-eventos
```

### Opción 2: Heroku
```bash
heroku create mi-api-eventos
git push heroku main
```

### Opción 3: Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
```

## 📞 Soporte

Para problemas, abre una issue en el repositorio o consulta la documentación de:
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Pandas Docs](https://pandas.pydata.org/)
- [OneDrive API](https://docs.microsoft.com/en-us/onedrive/developer/rest-api/)

---

**Última actualización:** Abril 2024
