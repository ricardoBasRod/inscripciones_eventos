@echo off
REM Script para ejecutar Backend
REM Uso: run-backend.bat [--mock-data|--real-data]

if /I "%~1"=="--mock-data" set "USE_MOCK_DATA=true"
if /I "%~1"=="--real-data" set "USE_MOCK_DATA=false"
if not defined USE_MOCK_DATA set "USE_MOCK_DATA=false"
if /I "%USE_MOCK_DATA%"=="1" set "USE_MOCK_DATA=true"
if /I "%USE_MOCK_DATA%"=="yes" set "USE_MOCK_DATA=true"
if /I "%USE_MOCK_DATA%"=="on" set "USE_MOCK_DATA=true"

cls
echo.
echo ============================================================
echo   Backend - Gestion de Eventos
echo   http://localhost:8000
if /I "%USE_MOCK_DATA%"=="true" (
    echo   Datos: MOCK
) else (
    echo   Datos: REALES
)
echo ============================================================
echo.

REM Ir siempre al directorio del script
cd /d "%~dp0"
cd backend

REM Verificar si venv existe
if not exist "venv" (
    echo Entorno virtual no encontrado
    echo Ejecuta primero: setup.bat
    pause
    exit /b 1
)

REM Verificar Python del entorno virtual
if not exist "venv\Scripts\python.exe" (
    echo Entorno virtual incompleto ^(falta venv\Scripts\python.exe^)
    echo Ejecuta primero: setup.bat
    pause
    exit /b 1
)

echo Iniciando Backend...
echo.
venv\Scripts\python.exe main.py

pause
