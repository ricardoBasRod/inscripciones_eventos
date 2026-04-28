# 🚀 Instalación Completa - Paso a Paso

Guía detallada para instalar y ejecutar el proyecto completo desde cero.

## 📋 Requisitos del Sistema

### Verificar que tengas instalado

**Windows, Mac o Linux:**
- Windows 10/11, macOS 10.15+, o cualquier Linux moderno
- Conexión a internet

**Software requerido:**
- Node.js 18+ (para Frontend)
- Python 3.9+ (para Backend)
- Git (para clonar el repositorio)

## ✅ Paso 1: Verificar Instalación

### Verificar Node.js y npm

Abre una terminal y ejecuta:

```bash
node --version
npm --version
```

Deberías ver versiones como:
```
v18.17.0
9.6.7
```

**¿No tienes Node.js?**
1. Ve a https://nodejs.org/
2. Descarga la versión LTS
3. Instala siguiendo el asistente
4. Reinicia tu computadora

### Verificar Python

```bash
python --version
# o
python3 --version
```

Deberías ver:
```
Python 3.11.x
```

**¿No tienes Python?**
1. Ve a https://www.python.org/downloads/
2. Descarga Python 3.11 o superior
3. **IMPORTANTE:** Al instalar, marca "Add Python to PATH"
4. Reinicia tu computadora

### Verificar Git

```bash
git --version
```

Deberías ver:
```
git version 2.x.x
```

## 📥 Paso 2: Clonar o Descargar el Repositorio

### Opción A: Con Git

```bash
git clone <URL_DEL_REPOSITORIO>
cd inscripciones_eventos
```

### Opción B: Descargar ZIP

1. Ve al repositorio en GitHub
2. Haz clic en "Code" → "Download ZIP"
3. Extrae el archivo
4. Abre terminal en la carpeta extraída

## 🔧 Paso 3: Configuración del Backend

### 3.1 Navegar a la carpeta backend

```bash
cd backend
```

### 3.2 Crear entorno virtual de Python

**Windows:**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Mac/Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

Deberías ver `(venv)` en el principio de cada línea de tu terminal.

### 3.3 Instalar dependencias Python

```bash
pip install -r requirements.txt
```

Esto descargará FastAPI, Pandas, y otras librerías. Puede tardar 2-5 minutos.

### 3.4 Crear archivo .env

**Windows:**
```powershell
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

### 3.5 Configurar OneDrive URL

Abre el archivo `backend/.env` con tu editor favorito (VS Code, Notepad, etc.):

```ini
ONEDRIVE_URL=https://1drv.ms/x/c/b19f31b2afda8ba0/IQCxNEN3UmXBQLI_rl5VESYZAQqLNYWhB5ipHNjRt0Wprbs?e=oCO30X
DEBUG=True
HOST=0.0.0.0
PORT=8000
FRONTEND_URL=http://localhost:4200
```

**Guarda el archivo.**

### 3.6 Probar el Backend

```bash
python main.py
```

Deberías ver:
```
INFO:     Application startup complete
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ **Backend está listo**

Abre en tu navegador:
```
http://localhost:8000/health
```

Deberías ver:
```json
{"status": "healthy"}
```

**Deja corriendo el Backend** y abre otra terminal para el Frontend.

## 🎨 Paso 4: Configuración del Frontend

### 4.1 Abrir nueva terminal

Abre una nueva ventana de terminal o cmd.

### 4.2 Navegar a frontend

```bash
cd frontend
```

### 4.3 Instalar dependencias Node

```bash
npm install
```

Esto descargará Angular y dependencias. Puede tardar 5-10 minutos la primera vez.

### 4.4 Ejecutar Frontend

```bash
npm start
```

Deberías ver:
```
✔ Compiled successfully.
> Application bundle generation complete.
Application running on http://localhost:4200
```

El navegador debería abrirse automáticamente en `http://localhost:4200`.

## 🎉 Paso 5: Verificar Todo Funciona

1. **Backend:**
   - Abre http://localhost:8000/health
   - Deberías ver: `{"status": "healthy"}`

2. **API de Datos:**
   - Abre http://localhost:8000/api/datos
   - Deberías ver JSON con tus datos de Excel

3. **Frontend:**
   - Abre http://localhost:4200
   - Haz clic en "Descargar Información"
   - Los datos aparecerán en la tabla

## 📊 Resultado Esperado

En el navegador deberías ver:

```
┌─────────────────────────────────────────────────────┐
│  Gestión de Eventos - Inscripciones                 │
│  Descarga y visualiza la información de inscripciones│
│                                                     │
│  [📥 Descargar Información]                         │
│                                                     │
│  Datos de Inscripciones                             │
│  ┌────────────────────────────────────────────────┐ │
│  │ id  │ nombre          │                        │ │
│  ├─────┼─────────────────┤                        │ │
│  │ 1   │ Dato 1          │                        │ │
│  │ 2   │ Dato 2          │                        │ │
│  │ 3   │ Dato 3          │                        │ │
│  │ 4   │ Dato 4          │                        │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## 🛑 Detener los Servicios

- Presiona `Ctrl + C` en cada terminal
- Los servicios se detendrán

## 🔄 Próximas Veces

Después de la instalación inicial:

### Quick Start Windows:
```powershell
.\start.bat
```

### Quick Start Mac/Linux:
```bash
bash start.sh
```

Esto abrirá automáticamente Backend y Frontend.

## 🔧 Comandos Útiles

### Frontend (en carpeta `frontend`)
```bash
npm start              # Ejecutar en desarrollo
npm run build          # Compilar para producción
npm test               # Ejecutar tests
```

### Backend (en carpeta `backend`)
```bash
python main.py         # Ejecutar
python -m pytest       # Ejecutar tests
pip list               # Ver dependencias instaladas
```

## ❌ Errores Comunes y Soluciones

### Error 1: "python: command not found"

**Problema:** Python no está instalado o no está en PATH

**Solución:**
1. Instala Python desde https://www.python.org/
2. Asegúrate de marcar "Add Python to PATH"
3. Reinicia tu computadora

### Error 2: "npm: command not found"

**Problema:** Node.js no está instalado

**Solución:**
1. Instala Node.js desde https://nodejs.org/
2. Reinicia tu computadora

### Error 3: "Backend no disponible"

**Problema:** El backend no está corriendo

**Solución:**
1. Verifica que tiene su propia terminal
2. Ejecuta `python main.py` en la carpeta `backend`
3. Verifica que dice "Application startup complete"

### Error 4: "pip install failed"

**Problema:** Error instalando dependencias

**Soluciones:**
```bash
# Actualizar pip
python -m pip install --upgrade pip

# Limpiar cache
pip install -r requirements.txt --no-cache-dir

# Instalar con permiso de administrador
pip install -r requirements.txt --user
```

### Error 5: "npm install failed"

**Problema:** Error instalando node_modules

**Soluciones:**
```bash
# Limpiar cache npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules
npm install

# En Windows
rmdir /s node_modules
npm install
```

### Error 6: "Port 4200 already in use"

**Problema:** Otro proceso está usando el puerto 4200

**Soluciones:**
```bash
# Ejecutar en otro puerto
ng serve --port 4201

# O buscar qué proceso usa el puerto
# Windows
netstat -ano | findstr :4200

# Mac/Linux
lsof -i :4200
```

### Error 7: "Port 8000 already in use"

**Problema:** Otro proceso está usando el puerto 8000

**Solución:**
Cambia en `backend/.env`:
```ini
PORT=8001
```

Y en `frontend/src/app/services/data.service.ts`:
```typescript
private apiUrl = 'http://localhost:8001/api';
```

## 📞 Soporte

Si aún tienes problemas:

1. **Revisa los READMEs:**
   - `frontend/README.md` - Problemas de Angular
   - `backend/README.md` - Problemas de FastAPI
   - `CONEXION_ONEDRIVE.md` - Problemas de conexión

2. **Busca en Google:** "Error message aquí" + "Angular"/"FastAPI"

3. **Abre un issue:** En el repositorio de GitHub

## ✅ Checklist Final

- [ ] Node.js instalado (`node --version`)
- [ ] Python instalado (`python --version`)
- [ ] Git instalado (`git --version`)
- [ ] Repositorio clonado o descargado
- [ ] Backend configurado con URL de OneDrive
- [ ] Backend ejecutándose sin errores
- [ ] Frontend ejecutándose sin errores
- [ ] Puedo acceder a http://localhost:4200
- [ ] Puedo descargar datos desde el botón
- [ ] Los datos aparecen en la tabla

## 🎓 Próximos Pasos

Ahora que tienes todo funcionando:

1. Lee [CONEXION_ONEDRIVE.md](./CONEXION_ONEDRIVE.md) para entender la arquitectura
2. Explora el código en `frontend/src` y `backend/`
3. Modifica los estilos CSS en `frontend/src/app/app.component.css`
4. Agrega nuevos endpoints en `backend/main.py`
5. Consulta el [ROADMAP.md](./ROADMAP.md) para features futuras

## 🎉 ¡Felicidades!

Tu aplicación Full-Stack está funcionando. ¡A disfrutar programando!

---

**Última actualización:** Abril 2024
