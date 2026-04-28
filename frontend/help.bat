@echo off
REM Script de ayuda para gestión del proyecto (Windows)
REM Uso: help.bat

echo.
echo ╔════════════════════════════════════════════╗
echo ║  Gestión de Eventos - Comandos Útiles      ║
echo ╚════════════════════════════════════════════╝
echo.

echo 📥 INSTALACIÓN Y SETUP
echo ├─ npm install          Instalar dependencias
echo ├─ npm start            Iniciar servidor (abre http://localhost:4200)
echo └─ npm run build        Compilar para producción
echo.

echo 🧪 TESTING
echo ├─ npm test             Ejecutar tests
echo ├─ npm test -- --watch=false   Tests una sola vez
echo └─ npm test -- --code-coverage Cobertura de tests
echo.

echo 🛠️ DESARROLLO
echo ├─ ng serve            Servidor de desarrollo
echo ├─ ng generate component components/nombre
echo ├─ ng generate service services/nombre
echo └─ ng lint             Verificar código
echo.

echo 📚 DOCUMENTACIÓN
echo ├─ README.md           Información general
echo ├─ INSTALACION.md      Guía de instalación
echo ├─ DESARROLLO.md       Guía para desarrolladores
echo └─ ROADMAP.md          Plan futuro del proyecto
echo.

echo 🔍 INFORMACIÓN UTIL
node --version | findstr /R "v[0-9]" >nul && (
    echo ├─ Node version:  %COMSPEC% /c node --version
) || (
    echo ├─ Node version:  NO INSTALADO
)

npm --version | findstr /R "[0-9]" >nul && (
    echo ├─ npm version:   %COMSPEC% /c npm --version
) || (
    echo ├─ npm version:   NO INSTALADO
)

echo └─ Angular CLI:   ng --version
echo.

echo 💡 TIPS
echo ├─ Presiona Ctrl+C para detener el servidor
echo ├─ Los cambios se reflejan automáticamente
echo └─ Abre DevTools: F12 o Ctrl+Shift+I
echo.

pause
