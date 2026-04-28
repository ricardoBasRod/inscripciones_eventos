#!/usr/bin/env python3
"""
Script de validación del proyecto
Verifica que todo está correctamente configurado
"""

import os
import sys
import json
import subprocess

def check_file(path, name):
    """Verifica que un archivo existe"""
    exists = os.path.exists(path)
    status = "✅" if exists else "❌"
    print(f"{status} {name}: {path}")
    return exists

def check_command(cmd, name):
    """Verifica que un comando está disponible"""
    try:
        subprocess.run([cmd, "--version"], capture_output=True, timeout=5)
        print(f"✅ {name} instalado")
        return True
    except:
        print(f"❌ {name} NO instalado")
        return False

def main():
    print("\n" + "="*60)
    print("🔍 VALIDACIÓN DEL PROYECTO - Gestión de Eventos")
    print("="*60 + "\n")
    
    # Verificar comandos
    print("📋 Verificando comandos del sistema:")
    print("-" * 40)
    node_ok = check_command("node", "Node.js")
    python_ok = check_command("python", "Python")
    git_ok = check_command("git", "Git")
    print()
    
    # Verificar estructura
    print("📁 Verificando estructura del proyecto:")
    print("-" * 40)
    
    files_to_check = [
        ("backend/main.py", "Backend - main.py"),
        ("backend/requirements.txt", "Backend - requirements.txt"),
        ("backend/.env.example", "Backend - .env.example"),
        ("backend/config.py", "Backend - config.py"),
        ("backend/Dockerfile", "Backend - Dockerfile"),
        ("frontend/package.json", "Frontend - package.json"),
        ("frontend/angular.json", "Frontend - angular.json"),
        ("frontend/src/app/app.component.ts", "Frontend - app.component.ts"),
        ("frontend/src/app/services/data.service.ts", "Frontend - data.service.ts"),
        ("frontend/Dockerfile", "Frontend - Dockerfile"),
        ("docker-compose.yml", "Docker Compose"),
        ("setup.bat", "Setup Windows"),
        ("setup.sh", "Setup Unix/Mac"),
        ("start.bat", "Start Windows"),
        ("start.sh", "Start Unix/Mac"),
    ]
    
    files_ok = 0
    for file_path, name in files_to_check:
        if check_file(file_path, name):
            files_ok += 1
    
    print()
    
    # Verificar documentación
    print("📚 Verificando documentación:")
    print("-" * 40)
    
    docs_to_check = [
        ("README_FULL.md", "README Full (principal)"),
        ("CONEXION_ONEDRIVE.md", "Guía de Conexión OneDrive"),
        ("ESTRUCTURA.md", "Documentación de Estructura"),
        ("INSTALACION_COMPLETA.md", "Guía de Instalación Completa"),
        ("backend/README.md", "Backend README"),
    ]
    
    docs_ok = 0
    for file_path, name in docs_to_check:
        if check_file(file_path, name):
            docs_ok += 1
    
    print()
    
    # Resumen
    print("="*60)
    print("📊 RESUMEN")
    print("="*60)
    
    print(f"\nSistema:")
    print(f"  Node.js: {'✅ OK' if node_ok else '❌ FALTA'}")
    print(f"  Python: {'✅ OK' if python_ok else '❌ FALTA'}")
    print(f"  Git: {'✅ OK' if git_ok else '❌ FALTA'}")
    
    print(f"\nArchivos: {files_ok}/{len(files_to_check)} ✅")
    print(f"Documentación: {docs_ok}/{len(docs_to_check)} ✅")
    
    # Recomendaciones
    print("\n" + "="*60)
    print("📝 PRÓXIMOS PASOS")
    print("="*60 + "\n")
    
    if not (node_ok and python_ok):
        print("⚠️ Instala los requisitos del sistema:")
        if not node_ok:
            print("   - Node.js: https://nodejs.org/")
        if not python_ok:
            print("   - Python: https://www.python.org/")
    else:
        print("✅ Todos los requisitos del sistema están OK")
    
    print("\n1️⃣ Configura OneDrive:")
    print("   - Edita backend/.env")
    print("   - Agrega tu URL de OneDrive")
    
    print("\n2️⃣ Inicia los servicios:")
    if sys.platform == "win32":
        print("   - Windows: .\\setup.bat && .\\start.bat")
    else:
        print("   - Mac/Linux: bash setup.sh && bash start.sh")
    
    print("\n3️⃣ Lee la documentación:")
    print("   - README_FULL.md - Visión general")
    print("   - CONEXION_ONEDRIVE.md - Cómo conectar")
    print("   - INSTALACION_COMPLETA.md - Setup detallado")
    
    print("\n" + "="*60 + "\n")
    
    if not (node_ok and python_ok and files_ok == len(files_to_check)):
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
