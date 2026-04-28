# 🏗️ Guía Completa de Estructura del Proyecto

Este documento explica la estructura completa del proyecto full-stack.

## 📁 Árbol de Directorios

```
inscripciones_eventos/
│
├── 📂 frontend/                          # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── services/
│   │   │   │   ├── data.service.ts      # Conecta con Backend
│   │   │   │   └── data.service.spec.ts
│   │   │   ├── app.component.ts         # Componente principal
│   │   │   ├── app.component.html       # Tabla + Botón
│   │   │   ├── app.component.css        # Estilos
│   │   │   └── app.routes.ts
│   │   ├── environments/
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── karma.conf.js
│   ├── Dockerfile                       # Para Docker
│   └── README.md
│
├── 📂 backend/                           # API FastAPI
│   ├── main.py                          # Archivo principal
│   ├── config.py                        # Configuración
│   ├── requirements.txt
│   ├── .env.example
│   ├── .env                             # Variables de entorno
│   ├── .gitignore
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models.py                    # Modelos Pydantic
│   │   ├── utils.py                     # Funciones auxiliares
│   │   └── services.py                  # Lógica de negocio
│   ├── Dockerfile                       # Para Docker
│   └── README.md
│
├── 📄 Archivos de Configuración Raíz
│   ├── docker-compose.yml               # Orquestación Docker
│   ├── setup.bat                        # Setup Windows
│   ├── setup.sh                         # Setup Unix/Mac
│   ├── start.bat                        # Iniciar servicios Windows
│   ├── start.sh                         # Iniciar servicios Unix/Mac
│   ├── .gitignore
│   ├── .editorconfig
│   └── ROADMAP.md
│
├── 📚 Documentación
│   ├── README.md                        # Overview
│   ├── README_PROJECT.md                # Estructura principal
│   ├── CONEXION_ONEDRIVE.md             # Guía conexión
│   ├── ESTRUCTURA.md                    # Este archivo
│   ├── CONTRIBUIR.md                    # Guía de contribución
│   └── INSTALACION_COMPLETA.md          # Setup detallado
```

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────┐
│                    Navegador                         │
│              http://localhost:4200                   │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ Solicitud HTTP
                       ▼
┌─────────────────────────────────────────────────────┐
│           Frontend Angular (Puerto 4200)             │
│                                                      │
│  app.component.ts                                   │
│    └─ Muestra botón "Descargar"                    │
│    └─ Llama a data.service.ts                      │
│                                                      │
│  data.service.ts                                    │
│    └─ HTTP GET a http://localhost:8000/api/datos   │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ HTTP GET /api/datos
                       ▼
┌─────────────────────────────────────────────────────┐
│          Backend FastAPI (Puerto 8000)              │
│                                                      │
│  main.py - Endpoint GET /api/datos                 │
│    └─ Obtiene URL de .env                          │
│    └─ Descarga archivo de OneDrive                 │
│    └─ Procesa Excel con pandas                     │
│    └─ Retorna JSON                                 │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ HTTP GET (URL compartida)
                       ▼
┌─────────────────────────────────────────────────────┐
│            OneDrive Cloud (Microsoft)                │
│                                                      │
│         archivo.xlsx compartido                     │
│  ┌─────────────────────────────────────┐            │
│  │  id   │  nombre                     │            │
│  ├───────┼──────────────────────────────┤            │
│  │  1    │  Dato 1                     │            │
│  │  2    │  Dato 2                     │            │
│  │  3    │  Dato 3                     │            │
│  │  4    │  Dato 4                     │            │
│  └─────────────────────────────────────┘            │
└─────────────────────────────────────────────────────┘
```

## 🛠️ Stack Tecnológico

### Frontend
- **Angular 18** - Framework principal
- **TypeScript** - Lenguaje tipado
- **RxJS** - Programación reactiva
- **HTML 5** - Estructura
- **CSS 3** - Estilos responsivos
- **Jasmine/Karma** - Testing

### Backend
- **FastAPI** - Framework Web
- **Python 3.11** - Lenguaje
- **Pandas** - Procesamiento de Excel
- **OpenPyXL** - Lectura de Excel
- **HTTPx** - Cliente HTTP asincrónico
- **Pydantic** - Validación de datos

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación
- **Git** - Control de versiones

## 📝 Características Principales

### Frontend
✅ Interfaz responsiva
✅ Tabla dinámica
✅ Botón descargar
✅ Indicador de carga
✅ Manejo de errores
✅ Standalone components

### Backend
✅ API REST
✅ CORS habilitado
✅ Descargar de OneDrive
✅ Procesar Excel
✅ Swagger documentación
✅ Logging configurado

### Infraestructura
✅ Docker setup
✅ Scripts de inicialización
✅ Variables de entorno
✅ Archivo .gitignore
✅ Documentación completa

## 🚀 Cómo Usar Cada Parte

### 1. Iniciar Todo Automáticamente

#### Windows:
```powershell
# Primera vez
.\setup.bat

# Luego iniciar
.\start.bat
```

#### Mac/Linux:
```bash
# Primera vez
bash setup.sh

# Luego iniciar
bash start.sh
```

### 2. Iniciar Manual por Componente

#### Backend:
```bash
cd backend

# Windows
.\venv\Scripts\Activate.ps1

# Mac/Linux
source venv/bin/activate

# Instalar (primera vez)
pip install -r requirements.txt

# Ejecutar
python main.py
```

#### Frontend:
```bash
cd frontend

# Instalar (primera vez)
npm install

# Ejecutar
npm start
```

### 3. Con Docker:
```bash
# Construir y ejecutar
docker-compose up

# Acceder
# Frontend: http://localhost:4200
# Backend: http://localhost:8000
```

## 🔗 Conexiones Entre Componentes

### Frontend → Backend

**Archivo:** `frontend/src/app/services/data.service.ts`

```typescript
// URL del backend
private apiUrl = 'http://localhost:8000/api';

// Llamada al backend
downloadFromOneDrive(): Observable<any[]> {
  return this.http.get<DatosResponse>(`${this.apiUrl}/datos`)
}
```

### Backend → OneDrive

**Archivo:** `backend/main.py`

```python
# URL de OneDrive en .env
ONEDRIVE_URL = os.getenv("ONEDRIVE_URL", "https://1drv.ms/x/...")

# Descargar en endpoint
@app.get("/api/datos")
async def obtener_datos():
    download_url = _convertir_url_onedrive(ONEDRIVE_URL)
    # Descargar y procesar
```

## 📊 Modelos de Datos

### Respuesta del Backend

```json
{
  "success": true,
  "total": 4,
  "columns": ["id", "nombre"],
  "data": [
    {"id": 1, "nombre": "Dato 1"},
    {"id": 2, "nombre": "Dato 2"},
    {"id": 3, "nombre": "Dato 3"},
    {"id": 4, "nombre": "Dato 4"}
  ]
}
```

### Modelos Python (Pydantic)

```python
class DatosResponse(BaseModel):
    success: bool
    total: int
    columns: List[str]
    data: List[Dict[str, Any]]
```

## 🔐 Variables de Entorno

### Backend (.env)
```ini
ONEDRIVE_URL=https://1drv.ms/x/c/...
DEBUG=True
HOST=0.0.0.0
PORT=8000
FRONTEND_URL=http://localhost:4200
```

## 📦 Dependencias Principales

### Frontend (package.json)
- @angular/core: ^18.0.0
- @angular/common: ^18.0.0
- rxjs: ^7.8.0
- typescript: ~5.4.2

### Backend (requirements.txt)
- fastapi==0.104.1
- uvicorn==0.24.0
- pandas==2.1.3
- openpyxl==3.11.0
- httpx==0.25.1

## 📚 Documentación Relacionada

- [Frontend README](./frontend/README.md) - Detalles de Angular
- [Backend README](./backend/README.md) - Detalles de FastAPI
- [Conexión OneDrive](./CONEXION_ONEDRIVE.md) - Cómo conectar
- [Roadmap](./ROADMAP.md) - Plan futuro

## 🧪 Testing

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
python -m pytest
```

## 🚀 Deployment

### Opción 1: Azure
```bash
az webapp up --name mi-app-eventos
```

### Opción 2: Heroku
```bash
heroku create mi-app-eventos
git push heroku main
```

### Opción 3: Docker Hub
```bash
docker build -t usuario/eventos-backend ./backend
docker push usuario/eventos-backend
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📞 Soporte

Para problemas, consulta:
- `CONEXION_ONEDRIVE.md` - Problemas de conexión
- `backend/README.md` - Problemas del backend
- `frontend/README.md` - Problemas del frontend

---

**Última actualización:** Abril 2024
