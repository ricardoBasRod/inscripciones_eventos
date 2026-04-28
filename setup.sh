#!/bin/bash
# Script de setup para el proyecto completo
# Uso: bash setup.sh

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║     Setup - Gestión de Eventos Full-Stack              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Detectar SO
if [[ "$OSTYPE" == "win32" || "$OSTYPE" == "msys" ]]; then
    OS="Windows"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="MacOS"
else
    OS="Linux"
fi

echo "🖥️ Sistema Operativo: $OS"
echo ""

# Setup Backend
echo "📦 Configurando Backend..."
cd backend

# Crear venv si no existe
if [ ! -d "venv" ]; then
    echo "  Creando entorno virtual..."
    python -m venv venv
fi

# Activar venv
if [[ "$OSTYPE" == "msys" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Instalar dependencias
echo "  Instalando dependencias Python..."
pip install -r requirements.txt

# Crear .env si no existe
if [ ! -f ".env" ]; then
    echo "  Creando archivo .env..."
    cp .env.example .env
fi

cd ..
echo "  ✅ Backend configurado"
echo ""

# Setup Frontend
echo "📦 Configurando Frontend..."
cd frontend

# Instalar node_modules si no existe
if [ ! -d "node_modules" ]; then
    echo "  Instalando dependencias Node..."
    npm install
fi

cd ..
echo "  ✅ Frontend configurado"
echo ""

echo "╔════════════════════════════════════════════════════════╗"
echo "║              ✅ Setup Completado                       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1. Configura la URL de OneDrive en backend/.env:"
echo "   ONEDRIVE_URL=https://1drv.ms/x/c/..."
echo ""
echo "2. Inicia el Backend (en una terminal):"
echo "   cd backend"
if [[ "$OSTYPE" == "msys" ]]; then
    echo "   .\\venv\\Scripts\\Activate.ps1"
else
    echo "   source venv/bin/activate"
fi
echo "   python main.py"
echo ""
echo "3. Inicia el Frontend (en otra terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "4. Abre http://localhost:4200 en tu navegador"
echo ""
