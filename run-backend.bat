@echo off
REM Script para ejecutar Backend
REM Uso: run-backend.bat

cls
echo.
echo ============================================================
echo   Backend - Gestion de Eventos
echo   http://localhost:8000
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
