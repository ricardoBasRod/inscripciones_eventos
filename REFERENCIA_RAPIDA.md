# 🚀 Referencia Rápida de Instalación

Guía condensada con los comandos exactos para instalación rápida.

---

## 1️⃣ Instalación Rápida (Windows)

### Paso 1: Instalar herramientas necesarias
```bash
# Git
# Descargar desde: https://git-scm.com/download/win

# Node.js
# Descargar desde: https://nodejs.org/ (LTS)

# Docker Desktop (opcional pero recomendado)
# Descargar desde: https://www.docker.com/products/docker-desktop/
```

### Paso 2: Crear Google Sheets y Apps Script

Ver archivo `INSTALACION_NUEVA_MAQUINA.md` secciones 2 y 3.

**IMPORTANTE: Guarda estos dos valores:**
- `SHEET_ID`: Tu ID de Google Sheet
- `APPS_SCRIPT_URL`: URL de tu Google Apps Script

---

### Paso 3: Descargar proyecto

```bash
mkdir C:\Proyectos
cd C:\Proyectos
git clone <URL_DEL_REPOSITORIO>
cd inscripciones_eventos
```

---

### Paso 4: Configurar .env

Abre `backend\.env` y actualiza:

```env
EXCEL_SOURCE_URL=https://docs.google.com/spreadsheets/d/[TU_SHEET_ID]/edit?usp=sharing
EXCEL_SHEET_NAME=
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/[TU_APPS_SCRIPT_URL]/exec
GOOGLE_APPS_SCRIPT_SECRET=bonito10
GOOGLE_APPS_SCRIPT_READ=false

DEBUG=True
HOST=0.0.0.0
PORT=8000

FRONTEND_URL=http://localhost:4200
```

**Reemplaza:**
- `[TU_SHEET_ID]` → Tu ID de Google Sheet
- `[TU_APPS_SCRIPT_URL]` → Tu código de Apps Script

---

### Paso 5: Ejecutar con Docker

```bash
cd C:\Proyectos\inscripciones_eventos
docker-compose up --build
```

Espera a ver:
```
backend    | INFO:     Application startup complete [uvicorn]
```

Luego abre:
- Frontend: http://localhost:4200
- Backend: http://localhost:8000

**Presiona Ctrl+C para detener**

---

## 2️⃣ Ejecución Posterior (Windows)

Después de la instalación inicial, cada vez que quieras ejecutar:

```bash
cd C:\Proyectos\inscripciones_eventos
docker-compose up
```

---

## 1️⃣ Instalación Rápida (macOS)

### Paso 1: Instalar herramientas

```bash
# Instalar Homebrew (si no lo tienes)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Git, Node.js, Docker
brew install git nodejs docker-compose
brew install --cask docker

# Abrir Docker Desktop
open /Applications/Docker.app
```

### Paso 2-5: Igual que Windows

```bash
mkdir ~/Proyectos
cd ~/Proyectos
git clone <URL_DEL_REPOSITORIO>
cd inscripciones_eventos

# Editar backend/.env con tu editor favorito
nano backend/.env

# Ejecutar
docker-compose up --build
```

---

## 1️⃣ Instalación Rápida (Linux - Ubuntu/Debian)

### Paso 1: Instalar herramientas

```bash
sudo apt update
sudo apt install git nodejs npm

# Docker
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER
# REINICIA SESIÓN O EJECUTA:
newgrp docker
```

### Paso 2-5: Igual que Windows

```bash
mkdir ~/Proyectos
cd ~/Proyectos
git clone <URL_DEL_REPOSITORIO>
cd inscripciones_eventos

# Editar backend/.env
nano backend/.env
# Ctrl+X, Y, Enter para guardar

# Ejecutar
docker-compose up --build
```

---

## ⚙️ Sin Docker (Solo Development)

### Windows

**Terminal 1 - Backend:**
```bash
cd inscripciones_eventos\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd inscripciones_eventos\frontend
npm install
npm start
```

---

### macOS/Linux

**Terminal 1 - Backend:**
```bash
cd inscripciones_eventos/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 main.py
```

**Terminal 2 - Frontend:**
```bash
cd inscripciones_eventos/frontend
npm install
npm start
```

---

## 📋 Checklist Rápido

Antes de ejecutar, verifica:

- [ ] Git está instalado: `git --version`
- [ ] Node.js está instalado: `node --version`
- [ ] Docker está instalado (si lo usas): `docker --version`
- [ ] Google Sheet creado con las columnas correctas
- [ ] Google Apps Script desplegado y URL copiada
- [ ] archivo `backend/.env` actualizado con:
  - [ ] `EXCEL_SOURCE_URL` correcto
  - [ ] `GOOGLE_APPS_SCRIPT_URL` correcto
  - [ ] `GOOGLE_APPS_SCRIPT_SECRET` coincide

---

## 🔧 Comandos Útiles

### Detener la aplicación
```bash
Ctrl + C
```

### Reiniciar después de cambios
```bash
# Con Docker
docker-compose down
docker-compose up --build

# Sin Docker
# Presiona Ctrl+C en ambas terminales y vuelve a ejecutar
```

### Ver logs del backend
```bash
# Con Docker
docker-compose logs backend -f

# Sin Docker: verás los logs directamente en la terminal
```

### Ver logs del frontend
```bash
# Con Docker
docker-compose logs frontend -f

# Sin Docker: verás los logs directamente en la terminal
```

### Verificar que todo funciona
```bash
# Backend alive?
curl http://localhost:8000/health

# Frontend alive?
curl http://localhost:4200
```

---

## 🆘 Errores Comunes (Rápido)

| Error | Solución |
|-------|----------|
| "docker: command not found" | Instala Docker, reinicia la terminal |
| "node: command not found" | Instala Node.js, reinicia la terminal |
| "ERR_EMPTY_RESPONSE en localhost:8000" | Backend no está corriendo, ejecuta `docker-compose up` |
| "El formato del archivo no coincide" | Verifica nombres de columnas exactos en Excel |
| "No se pudo guardar en Google Sheets" | Verifica `GOOGLE_APPS_SCRIPT_URL` y `GOOGLE_APPS_SCRIPT_SECRET` |
| "Conexión rechazada" | Puerto 8000 o 4200 en uso, cambia o cierra otra app |

---

## 📁 Estructura Esperada

```
inscripciones_eventos/
├── backend/
│   ├── app/
│   ├── .env ← EDITAR AQUÍ
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── angular.json
│   └── Dockerfile
├── docker-compose.yml
├── INSTALACION_NUEVA_MAQUINA.md
└── REFERENCIA_RAPIDA.md ← Este archivo
```

---

## 📞 URLs Importantes

- **Frontend:** http://localhost:4200
- **Backend:** http://localhost:8000
- **Health Check:** http://localhost:8000/health
- **API Docs:** http://localhost:8000/docs

---

## 🎯 Flujo Normal de Uso

1. Ejecuta `docker-compose up`
2. Abre http://localhost:4200
3. Haz clic en "Descargar" para ver datos
4. Usa los buscadores para filtrar
5. Haz clic en "Cargar" para subir Excel
6. Los datos se guardan en Google Sheets

---

**Versión:** 3.0.0  
**Última actualización:** 2026-06-17
