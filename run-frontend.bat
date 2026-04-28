@echo off
REM Script simplificado para ejecutar Frontend
REM Uso: run-frontend.bat

cls
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║        Frontend - Gestión de Eventos                    ║
echo ║        http://localhost:4200                            ║
echo ╚════════════════════════════════════════════════════════╝
echo.

cd frontend

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo ❌ Dependencias no instaladas
    echo Ejecuta primero: setup.bat
    pause
    exit /b 1
)

REM Iniciar Frontend
echo 🚀 Iniciando Frontend...
echo.
npm start

pause
