#!/bin/bash
# Script para iniciar Backend y Frontend simultáneamente en Unix/Linux/Mac

clear

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║        Iniciando Gestión de Eventos Full-Stack          ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Verificar si Node está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Descárgalo en: https://nodejs.org/"
    exit 1
fi

# Verificar si Python está instalado
if ! command -v python &> /dev/null; then
    echo "❌ Python no está instalado"
    echo "Descárgalo en: https://www.python.org/"
    exit 1
fi

echo "✅ Node.js y Python detectados"
echo ""

# Función para manejar la salida
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servicios detenidos"
    exit 0
}

# Trap para Ctrl+C
trap cleanup SIGINT

# Iniciar Backend
echo "🚀 Iniciando Backend (FastAPI)..."
cd backend
if [ -d "venv" ]; then
    source venv/bin/activate
    python main.py > /tmp/backend.log 2>&1 &
    BACKEND_PID=$!
    echo "   ✅ Backend iniciado (PID: $BACKEND_PID)"
else
    echo "   ❌ Entorno virtual no encontrado. Ejecuta setup.sh primero"
    exit 1
fi
cd ..

# Esperar a que el backend esté listo
sleep 3

# Iniciar Frontend
echo "🚀 Iniciando Frontend (Angular)..."
cd frontend
if [ -d "node_modules" ]; then
    npm start > /tmp/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "   ✅ Frontend iniciado (PID: $FRONTEND_PID)"
else
    echo "   ❌ node_modules no encontrado. Ejecuta setup.sh primero"
    kill $BACKEND_PID
    exit 1
fi
cd ..

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║           Servicios iniciados correctamente             ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📌 Acceso a los servicios:"
echo "   - Backend:  http://localhost:8000"
echo "   - Frontend: http://localhost:4200"
echo "   - Docs:     http://localhost:8000/docs"
echo ""
echo "💡 Tip: Los cambios en el código se reflejan automáticamente"
echo "💡 Presiona Ctrl+C para detener todos los servicios"
echo ""

# Mantener el script ejecutándose
wait
