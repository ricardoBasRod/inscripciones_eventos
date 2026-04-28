# 🎯 Gestión de Eventos - Inscripciones

Aplicación Full-Stack para gestionar eventos e inscripciones con datos desde Excel en OneDrive.

## ✨ Características

- 📱 **Frontend Angular** - Interfaz moderna y responsiva
- 🔧 **Backend FastAPI** - API REST potente y rápida
- ☁️ **Integración OneDrive** - Descarga automática de datos Excel
- 📊 **Tabla Dinámica** - Visualiza datos en tiempo real
- 🎨 **Diseño Responsive** - Funciona en desktop y móvil
- 🐳 **Docker Ready** - Deploy fácil con Docker

## 🚀 Quick Start

### Opción 1: Automático (Recomendado)

#### Windows:
```powershell
# Primera vez: setup completo
.\setup.bat

# Iniciar servicios
.\start.bat
```

#### Mac/Linux:
```bash
# Primera vez: setup completo
bash setup.sh

# Iniciar servicios
bash start.sh
```

### Opción 2: Manual

**Backend (en una terminal):**
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

**Frontend (en otra terminal):**
```bash
cd frontend
npm install
npm start
```

### Opción 3: Docker

```bash
docker-compose up
```

## 📍 Acceso a la Aplicación

Después de iniciar, accede a:

- **Frontend:** http://localhost:4200
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 📁 Estructura del Proyecto

```
inscripciones_eventos/
├── frontend/          # Aplicación Angular 18
│   ├── src/
│   ├── angular.json
│   └── package.json
├── backend/           # API FastAPI
│   ├── main.py
│   ├── requirements.txt
│   └── .env
├── setup.bat/.sh      # Scripts de configuración
├── start.bat/.sh      # Scripts de inicio
└── docker-compose.yml # Orquestación Docker
```

## 🔗 Configuración OneDrive

### 1. Compartir archivo en OneDrive

1. Ve a https://onedrive.live.com
2. Sube tu archivo Excel
3. Click derecho → "Compartir"
4. Copia el enlace de "Acceso a cualquiera"

### 2. Configurar backend/.env

```ini
ONEDRIVE_URL=https://1drv.ms/x/c/...
DEBUG=True
HOST=0.0.0.0
PORT=8000
FRONTEND_URL=http://localhost:4200
```

### 3. Verificar conexión

Abre en navegador:
```
http://localhost:8000/api/datos
```

Deberías ver tus datos en JSON.

## 📚 Documentación Completa

| Documento | Descripción |
|-----------|-------------|
| [CONEXION_ONEDRIVE.md](./CONEXION_ONEDRIVE.md) | 🔗 Guía completa de conexión |
| [ESTRUCTURA.md](./ESTRUCTURA.md) | 🏗️ Detalles de arquitectura |
| [frontend/README.md](./frontend/README.md) | 🎨 Documentación del Frontend |
| [backend/README.md](./backend/README.md) | ⚙️ Documentación del Backend |
| [ROADMAP.md](./ROADMAP.md) | 🗺️ Plan de desarrollo futuro |

## 🛠️ Stack Tecnológico

### Frontend
- Angular 18
- TypeScript
- RxJS
- CSS 3

### Backend
- FastAPI
- Python 3.11
- Pandas
- OpenPyXL

## 📊 Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Verifica estado del servidor |
| GET | `/api/datos` | Obtiene datos del Excel |
| GET | `/api/columnas` | Obtiene estructura del Excel |
| POST | `/api/datos/upload` | Carga Excel desde URL personalizada |

## ❓ Troubleshooting

### Backend no se conecta a OneDrive
- Verifica que la URL está en `.env`
- Verifica que el archivo está compartido públicamente
- Intenta descargar la URL manualmente

### Frontend no se conecta a Backend
- Verifica que Backend está corriendo en `http://localhost:8000`
- Verifica CORS en `backend/main.py`
- Abre DevTools (F12) y revisa la pestaña Network

### Error de puertos en uso
- Backend: Cambia puerto en `backend/.env`
- Frontend: Ejecuta `ng serve --port 4201`

Para más ayuda, consulta [CONEXION_ONEDRIVE.md](./CONEXION_ONEDRIVE.md)

## 🧪 Pruebas

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
pytest
```

## 📦 Dependencias

Para ver todas las dependencias:
- **Frontend:** Ver `frontend/package.json`
- **Backend:** Ver `backend/requirements.txt`

## 🚀 Deployment

### Docker (Recomendado)
```bash
docker-compose up
```

### Manual
Sigue las instrucciones en cada carpeta (`frontend/README.md` y `backend/README.md`)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

Para preguntas o sugerencias, abre un issue en el repositorio.

## 📄 Licencia

Este proyecto está bajo la licencia MIT - ver el archivo LICENSE para más detalles.

---

**¿Primer uso?** Lee [CONEXION_ONEDRIVE.md](./CONEXION_ONEDRIVE.md) primero!
