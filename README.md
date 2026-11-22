# Gestión de Eventos - Inscripciones

Aplicación web para gestionar inscripciones y asistencia a eventos. El frontend está desarrollado con Angular y se comunica con una API FastAPI que lee y actualiza los datos del archivo Excel local `database.xlsx`.

Desde la pantalla principal puedes abrir la toma de asistencia, elegir un curso y después buscar y seleccionar una de sus sesiones por fecha y hora. La lista muestra únicamente las inscripciones de esa sesión; la fecha de la sesión se propone como fecha de asistencia y puedes ajustarla antes de guardar. La API guarda para cada persona si asistió, sus notas y la fecha seleccionada en el Excel local.

Las sesiones disponibles se obtienen de las columnas `Fecha del curso` y `Hora del curso`, que se crean al cargar inscripciones con la fecha y hora incluidas en el campo del curso.

La sección de estadísticas permite consultar asistencias, inasistencias y total de inscripciones entre fechas usando `fecha_asistencia`, con un desglose mensual por curso. La estadística por carrera tiene un rango de fechas independiente, inicialmente del 1 de enero al 31 de diciembre del año actual.

## Requisitos previos

Instala estos programas antes de configurar el proyecto:

- **Windows 10/11** (para seguir la opción recomendada de esta guía).
- **Python 3.11 o posterior**, con `pip` y el comando `python` o el lanzador `py` disponibles en PATH. El instalador de Python para Windows permite agregar Python al PATH.
- **Node.js compatible con Angular 18**: Node.js 18.19.1 o posterior de la serie 18, 20.11.1 o posterior de la serie 20, o 22.0.0 o posterior de la serie 22. La instalación incluye `npm`.
- **Git**, solo si vas a clonar el repositorio desde la terminal. Si descargaste el proyecto como ZIP, no es necesario.
- **Conexión a Internet** durante la instalación de dependencias de Python y npm.

No es necesario instalar Angular CLI globalmente: se instala con las dependencias del frontend.

Comprueba las instalaciones desde PowerShell o Símbolo del sistema:

```powershell
python --version
node --version
npm --version
```

Si `python` no está disponible, prueba `py --version`. El setup también contempla el lanzador `py`.

## Obtener el código

Si aún no tienes una copia local:

```powershell
git clone https://github.com/ricardoBasRod/inscripciones_eventos.git
cd inscripciones_eventos
```

Si ya tienes el proyecto, abre PowerShell o Símbolo del sistema en la carpeta raíz del repositorio (la que contiene `setup.bat` y `start.bat`).

## Opción recomendada para Windows

1. Instala los requisitos previos indicados arriba.
2. Desde la carpeta raíz del proyecto, configura el backend y el frontend:

   ```powershell
   .\setup.bat
   ```

   El script crea el entorno virtual de Python, instala `backend\requirements.txt`, crea `backend\.env` a partir de `backend\.env.example` si todavía no existe e instala las dependencias del frontend.
3. Cuando termine el setup, inicia ambos servicios:

   ```powershell
   .\start.bat
   ```

   Se abrirá una ventana para cada servicio. La aplicación estará disponible en:

   - Frontend: <http://localhost:4200>
   - API: <http://localhost:8000>
   - Documentación interactiva de la API: <http://localhost:8000/docs>

   Para detenerlos, cierra las ventanas de backend y frontend.

El backend usa por defecto el archivo `database.xlsx` ubicado en la raíz del proyecto. Comprueba que esté presente. La configuración de esa ruta está en `backend\.env` mediante `LOCAL_EXCEL_PATH`; no se necesita configurar OneDrive para el funcionamiento actual.

## Probar con datos mock

El archivo `mock_data.xlsx` contiene registros sintéticos y mantiene las mismas columnas de inscripción que el Excel maestro. Para iniciar backend y frontend usando esos datos, ejecuta desde la raíz del proyecto:

```powershell
.\start.bat --mock-data
```

Para cargar también el Excel de prueba en los datos mock:

1. Inicia la aplicación con `.\start.bat --mock-data`.
2. En Gestión de Eventos, selecciona **Cargar archivo** y elige `mock_upload_course_schedule.xlsx`.
3. La carga agrega al archivo mock las filas nuevas; al usar `--mock-data`, no modifica `database.xlsx`.

Si quieres iniciar solo el backend con los mocks, ejecuta:

```powershell
.\run-backend.bat --mock-data
```

En otra terminal, inicia el frontend con `.\run-frontend.bat`. Sin `--mock-data`, los scripts usan `database.xlsx`; `.\start.bat --real-data` selecciona explícitamente esos datos.

## Archivos Excel

| Archivo | Uso |
| --- | --- |
| `database.xlsx` | Excel maestro predeterminado para el modo normal. Las cargas y el pase de lista escriben sus cambios en este archivo cuando no se usa `--mock-data`. |
| `mock_data.xlsx` | Excel maestro con registros sintéticos. Se selecciona con `.\start.bat --mock-data` y recibe los cambios hechos durante las pruebas en modo mock. |
| `mock_upload_course_schedule.xlsx` | Archivo listo para probar la carga actual: contiene 10 registros sintéticos nuevos y conserva las columnas del Excel de origen. El campo del curso usa el formato `SW0002 - WEBINAR Solidworks diseño básico CSWA - miércoles 15 de abril 2026 - 3:00 pm`; al importarlo, el nombre se separa de `Fecha del curso` y `Hora del curso`. |
| `mock_upload.xlsx` | Archivo de prueba anterior. No usar con la carga actual: no incluye `fecha_asistencia` y los cursos no tienen fecha y hora concatenadas en el formato requerido. |

En la toma de asistencia, primero se elige el curso y luego se puede buscar y seleccionar una sesión por fecha y hora. Esas opciones se leen de `Fecha del curso` y `Hora del curso`, columnas que se crean al cargar inscripciones con el formato nuevo.

## Ejecutar los servicios por separado en Windows

Después de ejecutar `.\setup.bat`, puedes iniciar cada servicio por separado. Abre dos terminales en la raíz del proyecto:

**Terminal 1 — backend:**

```powershell
.\run-backend.bat
```

**Terminal 2 — frontend:**

```powershell
.\run-frontend.bat
```

También puedes ejecutarlos directamente, sin los scripts auxiliares:

**Backend** (desde la raíz del proyecto):

```powershell
.\backend\venv\Scripts\python.exe .\backend\main.py
```

**Frontend**:

```powershell
cd frontend
npm start
```

El frontend requiere que el backend esté iniciado para cargar y guardar datos.

## Instalación y ejecución manuales

Si prefieres no usar los scripts, desde la raíz del proyecto prepara cada parte:

**Backend — PowerShell:**

```powershell
cd backend
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
.\venv\Scripts\python.exe main.py
```

**Frontend — en otra terminal, desde la raíz del proyecto:**

```powershell
cd frontend
npm install
npm start
```

En macOS o Linux, puedes preparar e iniciar los servicios manualmente así:

**Backend — terminal 1:**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
if [ ! -f .env ]; then cp .env.example .env; fi
python main.py
```

**Frontend — terminal 2, desde la raíz del proyecto:**

```bash
cd frontend
npm install
npm start
```

Los comandos crean `.env` solo si todavía no existe, para conservar una configuración previa.

## Desarrollo

Desde `frontend`, `npm start` inicia Angular con recarga automática. Para crear una compilación de producción:

```bash
cd frontend
npm run build
```

Los archivos generados se guardan en `frontend/dist/gestion-eventos-app/`.

La API se ejecuta desde `backend` con `python main.py`; sus endpoints de documentación están en <http://localhost:8000/docs>.

## Solución de problemas

- **`python` no se reconoce:** reinstala Python y habilita la opción para agregarlo al PATH, o verifica que el lanzador `py` esté instalado. El backend necesita Python 3.11 o posterior.
- **`node` o `npm` no se reconocen:** instala una versión compatible de Node.js y vuelve a abrir la terminal.
- **No se encuentra el entorno virtual o `node_modules`:** ejecuta primero `.\setup.bat` desde la raíz del proyecto.
- **La API indica que no existe el Excel:** comprueba que `database.xlsx` esté en la raíz o ajusta `LOCAL_EXCEL_PATH` en `backend\.env`.
- **El frontend no carga los datos:** confirma que el backend esté activo en el puerto 8000 y que el Excel esté disponible.
