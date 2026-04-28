#!/bin/bash
# Script para ver el resumen del proyecto
# Uso: bash info.sh

clear

cat << 'EOF'

╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🎯 PROYECTO: Gestión de Eventos - Full Stack           ║
║                                                              ║
║     ✅ COMPLETADO Y LISTO PARA USAR                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝


📋 CHECKLIST DE CONFIGURACIÓN
═══════════════════════════════════════════════════════════════

Antes de empezar, verifica:

  ☐ Tengo Node.js v18+         (node --version)
  ☐ Tengo Python 3.9+          (python --version)
  ☐ Tengo Git instalado        (git --version)
  ☐ Estoy en carpeta del proyecto
  ☐ Leí INICIO_RAPIDO.md


🚀 COMANDO PARA EMPEZAR (30 SEGUNDOS)
═══════════════════════════════════════════════════════════════

WINDOWS:
  .\setup.bat
  .\start.bat

MAC/LINUX:
  bash setup.sh
  bash start.sh

Luego abre: http://localhost:4200


📁 ESTRUCTURA DEL PROYECTO
═══════════════════════════════════════════════════════════════

backend/
  ├── main.py              - API REST (Descargar de OneDrive)
  ├── .env                 - Variables de entorno
  ├── requirements.txt     - Dependencias Python
  ├── config.py            - Configuración
  ├── Dockerfile           - Para Docker
  └── app/                 - Modularización

frontend/
  ├── src/app/
  │   ├── app.component.ts         - Componente principal
  │   ├── services/data.service.ts - Conexión con backend
  │   └── app.component.html       - Tabla + Botón
  ├── package.json         - Dependencias Angular
  ├── angular.json         - Config Angular
  ├── Dockerfile           - Para Docker
  └── README.md            - Documentación

Scripts/Configuración:
  ├── setup.bat / setup.sh    - Instalación inicial
  ├── start.bat / start.sh    - Iniciar servicios
  ├── docker-compose.yml      - Stack completo con Docker
  └── validate.py             - Validar proyecto


📚 DOCUMENTACIÓN
═══════════════════════════════════════════════════════════════

Orden de lectura recomendado:

1. ⭐ INICIO_RAPIDO.md          - EMPIEZA AQUÍ (5 min)
2. 📖 README_FULL.md            - Overview (10 min)
3. 🔗 CONEXION_ONEDRIVE.md      - Entender conexión (15 min)
4. 📋 INSTALACION_COMPLETA.md   - Setup detallado (20 min)
5. 🏗️ ESTRUCTURA.md             - Arquitectura (15 min)
6. ⚙️ backend/README.md         - FastAPI (10 min)
7. 🎨 frontend/README.md        - Angular (10 min)
8. 🗺️ ROADMAP.md                - Futuro (5 min)


🎯 ACCESO A SERVICIOS
═══════════════════════════════════════════════════════════════

Una vez ejecutes start.bat o bash start.sh:

Frontend:      http://localhost:4200
Backend:       http://localhost:8000
API Docs:      http://localhost:8000/docs
Health Check:  http://localhost:8000/health


⚡ FLUJO DE DATOS
═══════════════════════════════════════════════════════════════

1. Usuario abre http://localhost:4200
2. Ve botón "Descargar Información"
3. Click → app.component.ts llama data.service.ts
4. data.service.ts hace GET a http://localhost:8000/api/datos
5. Backend descarga tu Excel de OneDrive
6. Backend retorna JSON con los datos
7. Frontend llena la tabla con los datos ✨


🔧 CONFIGURACIÓN ONEDRIVE
═══════════════════════════════════════════════════════════════

Tu URL ya está en backend/.env:

  ONEDRIVE_URL=https://1drv.ms/x/c/b19f31b2afda8ba0/...

Si cambias el archivo:
  1. Ve a https://onedrive.live.com
  2. Click derecho en archivo → Compartir
  3. Copia el enlace "Acceso a cualquiera"
  4. Pega en backend/.env


🛠️ COMANDOS COMUNES
═══════════════════════════════════════════════════════════════

Frontend (en carpeta frontend/):
  npm start          - Ejecutar en desarrollo
  npm run build      - Compilar para producción
  npm test           - Ejecutar tests

Backend (en carpeta backend/):
  python main.py     - Ejecutar
  python -m pytest   - Tests

Validar:
  python validate.py - Verifica todo está OK

Docker:
  docker-compose up  - Inicia todo


❓ SOLUCIÓN RÁPIDA
═══════════════════════════════════════════════════════════════

Backend no conecta:
  → Verifica backend/.env tiene tu URL
  → Verifica que Backend está corriendo

Frontend no se carga:
  → Verifica que Frontend está corriendo en otra terminal

npm error:
  → rm -rf node_modules && npm install

pip error:
  → pip install -r requirements.txt --user

Puertos ocupados:
  → Backend: Cambia PORT en backend/.env
  → Frontend: ng serve --port 4201


🎓 PRÓXIMOS PASOS
═══════════════════════════════════════════════════════════════

1. Lee INICIO_RAPIDO.md
2. Ejecuta setup.bat o bash setup.sh
3. Ejecuta start.bat o bash start.sh
4. Abre http://localhost:4200
5. Haz clic en "Descargar Información"
6. ¡Verás tu tabla! 🎉


✅ CHECKLIST FINAL
═══════════════════════════════════════════════════════════════

  ☐ setup.bat o setup.sh ejecutado sin errores
  ☐ start.bat o start.sh iniciaron Backend y Frontend
  ☐ Frontend accesible en http://localhost:4200
  ☐ Backend responsivo en http://localhost:8000/health
  ☐ Al clickear botón, datos aparecen en tabla
  ☐ Leí documentación principal


📞 NECESITAS AYUDA?
═══════════════════════════════════════════════════════════════

1. Revisa INICIO_RAPIDO.md → ¿Primer uso?
2. Revisa CONEXION_ONEDRIVE.md → Troubleshooting
3. Revisa INSTALACION_COMPLETA.md → Errores comunes
4. Abre DevTools (F12) y revisa Network/Console
5. Ejecuta: python validate.py


═══════════════════════════════════════════════════════════════

¡Tu aplicación está lista!

Solo ejecuta:
  .\start.bat (Windows)
  bash start.sh (Mac/Linux)

Y abre http://localhost:4200 🎉

═══════════════════════════════════════════════════════════════

Version: 1.0.0
Fecha: Abril 2024
Estado: ✅ Listo para Producción

═══════════════════════════════════════════════════════════════

EOF
