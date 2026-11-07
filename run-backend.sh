#!/bin/bash
# Script simplificado para ejecutar Backend
# Uso: bash run-backend.sh [--mock-data|--real-data]

case "${1:-}" in
    --mock-data) export USE_MOCK_DATA=true ;;
    --real-data) export USE_MOCK_DATA=false ;;
esac
export USE_MOCK_DATA="${USE_MOCK_DATA:-false}"

clear

cat << 'EOF'

╔════════════════════════════════════════════════════════╗
║        Backend - Gestión de Eventos                     ║
║        http://localhost:8000                            ║
╚════════════════════════════════════════════════════════╝

EOF

cd backend

# Verificar si venv existe
if [ ! -d "venv" ]; then
    echo "❌ Entorno virtual no encontrado"
    echo "Ejecuta primero: bash setup.sh"
    exit 1
fi

# Activar venv e iniciar Backend
echo "🚀 Iniciando Backend..."
echo ""

if [[ "$OSTYPE" == "msys" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

python main.py
