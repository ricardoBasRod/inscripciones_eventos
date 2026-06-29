@echo off
REM Script para iniciar Backend y Frontend simultaneamente en Windows

cls
echo.
echo ============================================================
echo   Iniciando Gestion de Eventos Full-Stack
echo ============================================================
echo.

REM Ir siempre al directorio del script
cd /d "%~dp0"

REM Verificar si Node esta instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js no esta instalado.
    echo Descargalo en: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar entorno virtual del backend
if not exist "backend\venv\Scripts\python.exe" (
    echo Entorno virtual del backend no encontrado.
    echo Ejecuta primero: setup.bat
    pause
    exit /b 1
)

REM Verificar dependencias del frontend
if not exist "frontend\node_modules" (
    echo Dependencias del frontend no instaladas.
    echo Ejecuta primero: setup.bat
    pause
    exit /b 1
)

echo Node.js y entorno Python detectados.
echo.

echo Iniciando Backend (FastAPI)...
start "Backend - FastAPI" cmd /k "cd /d ""%~dp0backend"" && venv\Scripts\python.exe main.py"

timeout /t 3 /nobreak >nul

echo Iniciando Frontend (Angular)...
start "Frontend - Angular" cmd /k "cd /d ""%~dp0frontend"" && npm start"

echo.
echo ============================================================
echo   Servicios iniciandose
echo ============================================================
echo.
echo Ventanas abiertas:
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:4200
echo   Docs:     http://localhost:8000/docs
echo.
echo Para detener los servicios, cierra cada ventana.
echo.
pause
