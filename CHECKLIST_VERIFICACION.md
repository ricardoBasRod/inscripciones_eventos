# ✅ Checklist de Verificación Pre-Ejecución

Usa este checklist antes de ejecutar la aplicación para asegurarte de que todo está configurado correctamente.

---

## 📋 Requisitos del Sistema

- [ ] Sistema operativo: Windows 10+, macOS 10.14+, o Linux
- [ ] RAM disponible: Mínimo 4GB
- [ ] Espacio en disco: Mínimo 2GB
- [ ] Conexión a Internet: Activa
- [ ] Navegador moderno: Chrome, Firefox, Safari o Edge

---

## 🛠️ Herramientas Instaladas

### Git

- [ ] Git está instalado
  ```bash
  git --version
  ```
  Debe mostrar una versión (ej: git version 2.40.0)

### Node.js y npm

- [ ] Node.js está instalado (versión 18+)
  ```bash
  node --version
  ```
  Debe mostrar v18.x.x o superior

- [ ] npm está instalado
  ```bash
  npm --version
  ```
  Debe mostrar una versión

### Docker (Opcional pero Recomendado)

- [ ] Docker está instalado (si lo vas a usar)
  ```bash
  docker --version
  ```
  Debe mostrar Docker version 20.x.x o superior

- [ ] Docker Compose está instalado
  ```bash
  docker-compose --version
  ```
  Debe mostrar docker-compose version 1.x.x o superior

- [ ] Docker Desktop está funcionando (Windows/Mac)
  - [ ] Docker Desktop aparece en la bandeja del sistema

### Python (Si NO usas Docker)

- [ ] Python 3.9+ está instalado
  ```bash
  python --version
  ```
  Debe mostrar Python 3.9 o superior

- [ ] pip está instalado
  ```bash
  pip --version
  ```
  Debe mostrar pip version 20.x.x o superior

---

## 📁 Proyecto Descargado

- [ ] La carpeta `inscripciones_eventos` existe
- [ ] Estructura del proyecto es correcta:
  ```
  inscripciones_eventos/
  ├── backend/
  ├── frontend/
  ├── docker-compose.yml
  └── README.md
  ```
- [ ] Todos los archivos principales existen:
  - [ ] `backend/main.py`
  - [ ] `backend/requirements.txt`
  - [ ] `backend/.env`
  - [ ] `frontend/package.json`
  - [ ] `frontend/src/app/app.component.ts`
  - [ ] `docker-compose.yml`

---

## 🔐 Configuración de Google Drive

### Google Sheet Creado

- [ ] Existe una carpeta en Google Drive para el proyecto
- [ ] Existe un Google Sheet en esa carpeta
- [ ] El Google Sheet se llama algo descriptivo (ej: "Registros_Inscripciones")
- [ ] El Sheet es **público** (Compartir → "Cualquiera con el enlace")

### Estructura de Columnas

En tu Google Sheet, verifica que tienes exactamente estas columnas en este orden:

- [ ] Columna A: `ID`
- [ ] Columna B: `Start time`
- [ ] Columna C: `Completion time`
- [ ] Columna D: `Email`
- [ ] Columna E: `Name`
- [ ] Columna F: `Last modified time`
- [ ] Columna G en adelante: Tus columnas personalizadas (preguntas del formulario)

**Verifica:** 
- [ ] Los nombres son exactamente iguales (mayúsculas, espacios, todo)
- [ ] El orden es exacto (no pueden estar reordenadas)
- [ ] No hay espacios extra en los header

### ID del Google Sheet

- [ ] Tienes guardado el ID del Sheet:
  ```
  https://docs.google.com/spreadsheets/d/[ESTE_ES_TU_ID]/edit?usp=sharing
  ```
  ID de ejemplo: `1PIQgMw0NIQ0F1vzEL8eCFENI36mKF_hcXSG49vH8Qvs`

---

## 🔧 Google Apps Script

### Script Creado y Desplegado

- [ ] Google Apps Script está creado
- [ ] Se llama algo descriptivo (ej: "InscripcionesEventosSync")
- [ ] Contiene el código completo (doGet, doPost, etc.)
- [ ] El código fue **guardado** (Ctrl+S)
- [ ] El script está **desplegado** como "Aplicación web"
- [ ] Está configurado con:
  - [ ] "Ejecutar como": Tu cuenta de Google
  - [ ] "Quién tiene acceso": Cualquiera
- [ ] Tienes la URL de desplegue guardada:
  ```
  https://script.google.com/macros/s/[CODIGO_LARGO]/exec
  ```

### Configuración del Apps Script

- [ ] El `SPREADSHEET_ID` en el código es correcto (ID de tu Sheet)
- [ ] El `SECRET` es el que deseas usar (por defecto: `bonito10`)
- [ ] El código en doGet lee datos correctamente
- [ ] El código en doPost escribe datos correctamente

### Prueba del Apps Script (Opcional)

- [ ] Ejecutaste la función `testRead()` desde el editor
- [ ] Recibiste una respuesta JSON válida con los datos

---

## 📝 Configuración del Backend (.env)

Abre `backend/.env` y verifica:

### EXCEL_SOURCE_URL

- [ ] Está presente
- [ ] Contiene la URL de tu Google Sheet
- [ ] Formato: `https://docs.google.com/spreadsheets/d/[TU_ID]/edit?usp=sharing`
- [ ] No está vacío

Ejemplo:
```env
EXCEL_SOURCE_URL=https://docs.google.com/spreadsheets/d/1PIQgMw0NIQ0F1vzEL8eCFENI36mKF_hcXSG49vH8Qvs/edit?usp=sharing
```

### EXCEL_SHEET_NAME

- [ ] Está presente
- [ ] Puede estar vacío (por defecto) o tener el nombre de la hoja

```env
EXCEL_SHEET_NAME=
```

### GOOGLE_APPS_SCRIPT_URL

- [ ] Está presente
- [ ] Contiene tu URL de Apps Script
- [ ] Formato: `https://script.google.com/macros/s/[CODIGO]/exec`
- [ ] No está vacío

Ejemplo:
```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwIRVOIBdjLOZGEG5H9BKRh4Ls7y8gEUHBq23PcpXXrY80bKMBv3GAXMpVFzT5UeGlP/exec
```

### GOOGLE_APPS_SCRIPT_SECRET

- [ ] Está presente
- [ ] Coincide exactamente con el `SECRET` en tu Google Apps Script
- [ ] Es exactamente igual (mayúsculas, caracteres especiales, todo)

```env
GOOGLE_APPS_SCRIPT_SECRET=bonito10
```

### GOOGLE_APPS_SCRIPT_READ

- [ ] Está presente
- [ ] Establecido en `false` (por ahora)

```env
GOOGLE_APPS_SCRIPT_READ=false
```

### DEBUG, HOST, PORT

- [ ] DEBUG=True
- [ ] HOST=0.0.0.0
- [ ] PORT=8000

### FRONTEND_URL

- [ ] Presente
- [ ] Establecido en: `http://localhost:4200`

---

## 📦 Dependencias del Proyecto

### Frontend (Node.js)

- [ ] La carpeta `frontend/node_modules/` existe
  - Si no existe, ejecuta: `cd frontend && npm install`
- [ ] El archivo `frontend/package.json` contiene las dependencias

### Backend (Python)

**Si usas Docker:**
- [ ] El archivo `backend/requirements.txt` existe

**Si NO usas Docker:**
- [ ] La carpeta `backend/venv/` existe
  - Si no existe, ejecuta:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # macOS/Linux
    # o
    venv\Scripts\activate  # Windows
    pip install -r requirements.txt
    ```
- [ ] El archivo `backend/requirements.txt` contiene las dependencias

---

## 🐳 Docker (Si lo usas)

- [ ] Archivo `docker-compose.yml` existe
- [ ] Contiene servicios: `backend` y `frontend`
- [ ] Archivos Dockerfile existen:
  - [ ] `backend/Dockerfile`
  - [ ] `frontend/Dockerfile`

---

## 📊 Datos de Prueba

- [ ] Tu Google Sheet tiene al menos 1 fila de datos (después del header)
- [ ] O tienes un archivo Excel preparado para cargar

---

## 🚀 Antes de Ejecutar

### Puertos Disponibles

- [ ] El puerto 8000 está disponible (backend)
  ```bash
  # Windows
  netstat -ano | findstr :8000
  # macOS/Linux
  lsof -i :8000
  ```
  No debe mostrar nada en uso

- [ ] El puerto 4200 está disponible (frontend)
  ```bash
  # Windows
  netstat -ano | findstr :4200
  # macOS/Linux
  lsof -i :4200
  ```
  No debe mostrar nada en uso

### Ubicación Correcta

- [ ] Estás en la carpeta raíz del proyecto
  ```bash
  # Deberías estar en:
  C:\Proyectos\inscripciones_eventos  # Windows
  ~/Proyectos/inscripciones_eventos    # macOS/Linux
  
  # Y esto debe existir:
  docker-compose.yml
  ```

### Archivo .env no tiene líneas en blanco extra

- [ ] No hay líneas vacías entre variables
- [ ] No hay espacios antes de los valores
- [ ] El archivo termina con una línea nueva

---

## 🧪 Testeo de Configuración (Opcional)

### Verificar conectividad con Google Sheets

Desde la terminal, prueba (reemplaza con tu URL):

```bash
curl "https://script.google.com/macros/s/[TU_CODIGO]/exec?secret=bonito10"
```

Debe responder con JSON válido:
```json
{"success":true,"columns":[...],"data":[...]}
```

---

## ✨ Checklist Final

Antes de ejecutar, verifica que **TODOS estos items estén marcados:**

- [ ] Herramientas instaladas (Git, Node, Docker/Python)
- [ ] Google Sheet creado con estructura correcta
- [ ] Google Apps Script desplegado
- [ ] ID del Sheet guardado
- [ ] URL de Apps Script guardada
- [ ] `backend/.env` completamente configurado
- [ ] Dependencias instaladas (node_modules, venv)
- [ ] Puertos 8000 y 4200 disponibles
- [ ] Estoy en la carpeta raíz del proyecto
- [ ] Google Sheet tiene al menos 1 fila de datos

---

## 🎯 Próximos Pasos

Si todas las verificaciones pasaron:

### Con Docker
```bash
docker-compose up --build
```

### Sin Docker (Terminal 1 - Backend)
```bash
cd backend
source venv/bin/activate  # o venv\Scripts\activate en Windows
python main.py
```

### Sin Docker (Terminal 2 - Frontend)
```bash
cd frontend
npm start
```

---

## 📞 Si Algo Falla

Si algo en este checklist falla:

1. **Identifica cuál item no pasó**
2. **Busca la sección correspondiente** en `INSTALACION_NUEVA_MAQUINA.md`
3. **Sigue los pasos indicados** para arreglarlo
4. **Vuelve a marcar el item** cuando lo arregles
5. **Continúa hasta que todos los items pasen**

---

## 🎓 Consejos

- ✅ Guarda todos los IDs y URLs en un archivo de notas seguro
- ✅ Haz backup de tu Google Sheet regularmente
- ✅ Si cambias Google Sheet, actualiza `backend/.env` completamente
- ✅ Si ves errores de conexión, verifica primero que Docker/Backend estén corriendo
- ✅ Si ves errores de datos, verifica que el Google Sheet esté actualizado

---

**Versión:** 3.0.0  
**Última actualización:** 2026-06-17
