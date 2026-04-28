#!/bin/bash
# Script simplificado para ejecutar Frontend
# Uso: bash run-frontend.sh

clear

cat << 'EOF'

╔════════════════════════════════════════════════════════╗
║        Frontend - Gestión de Eventos                    ║
║        http://localhost:4200                            ║
╚════════════════════════════════════════════════════════╝

EOF

cd frontend

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencias no instaladas"
    echo "Ejecuta primero: bash setup.sh"
    exit 1
fi

# Iniciar Frontend
echo "🚀 Iniciando Frontend..."
echo ""

npm start
