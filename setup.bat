@echo off
setlocal
REM Script de setup para Windows
REM Uso: setup.bat

cls
echo.
echo ============================================================
echo   Setup - Gestion de Eventos Full-Stack
echo ============================================================
echo.
echo Sistema Operativo: Windows
echo.

REM Ir siempre al directorio del script
cd /d "%~dp0"

REM Setup Backend
echo Configurando Backend...
cd backend
if errorlevel 1 (
    echo No se pudo entrar a la carpeta backend.
    pause
    exit /b 1
)

if not exist "venv\Scripts\python.exe" (
    echo   Creando entorno virtual...
    python -m venv venv
    if errorlevel 1 (
        py -3.11 -m venv venv
    )
    if errorlevel 1 (
        py -m venv venv
    )
    if errorlevel 1 (
        echo Error creando el entorno virtual.
        echo Instala Python 3.11+ o agrega python/py al PATH.
        pause
        exit /b 1
    )
)

echo   Instalando dependencias Python...
venv\Scripts\python.exe -m pip install -r requirements.txt
if errorlevel 1 (
    echo Error instalando dependencias Python.
    pause
    exit /b 1
)

if not exist ".env" (
    echo   Creando archivo .env...
    copy /y .env.example .env >nul
)

cd ..
echo   Backend configurado
echo.

REM Setup Frontend
echo Configurando Frontend...
cd frontend
if errorlevel 1 (
    echo No se pudo entrar a la carpeta frontend.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo   Instalando dependencias Node...
    call npm install -q
    if errorlevel 1 (
        echo Error instalando dependencias Node.
        pause
        exit /b 1
    )
)

cd ..
echo   Frontend configurado
echo.

echo ============================================================
echo   Setup Completado
echo ============================================================
echo.
echo Proximos pasos:
echo.
echo 1. Verifica el archivo Excel local en la raiz del proyecto:
echo    database.xlsx
echo.
echo 2. Si cambias el nombre o ubicacion del archivo, actualiza backend\.env:
echo    LOCAL_EXCEL_PATH=../database.xlsx
echo.
echo 3. Inicia el backend:
echo    .\run-backend.bat
echo.
echo 4. Inicia el frontend en otra terminal:
echo    .\run-frontend.bat
echo.
pause
