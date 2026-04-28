@echo off
REM Script para iniciar Backend y Frontend simultáneamente en Windows

cls
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║        Iniciando Gestión de Eventos Full-Stack          ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Verificar si Node está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado
    echo Descárgalo en: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si Python está instalado
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python no está instalado
    echo Descárgalo en: https://www.python.org/
    pause
    exit /b 1
)

echo ✅ Node.js y Python detectados
echo.

REM Iniciar Backend en una nueva ventana
echo 🚀 Iniciando Backend (FastAPI)...
start "Backend - FastAPI" cmd /k "cd backend && call venv\Scripts\activate.bat && python main.py"

REM Esperar un poco para que el backend se inicie
timeout /t 3 /nobreak

REM Iniciar Frontend en otra nueva ventana
echo 🚀 Iniciando Frontend (Angular)...
start "Frontend - Angular" cmd /k "cd frontend && npm start"

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║           Servicios iniciándose...                      ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 📌 Ventanas abiertas:
echo   - Backend:  http://localhost:8000
echo   - Frontend: http://localhost:4200
echo   - Docs:     http://localhost:8000/docs
echo.
echo 💡 Tip: Los cambios en el código se reflejan automáticamente
echo 💡 Para detener los servicios, cierra cada ventana
echo.
pause
