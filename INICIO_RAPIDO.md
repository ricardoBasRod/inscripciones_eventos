# 📋 GUÍA RÁPIDA - Todo lo que Necesitas Saber

## ¿Qué acabo de recibir?

Un proyecto **Full-Stack completo** para gestionar eventos:

```
inscripciones_eventos/
├── 🎨 Frontend (Angular)          - Interfaz web
├── ⚙️ Backend (FastAPI)           - API REST
├── ☁️ Integración OneDrive        - Descarga de Excel
└── 📚 Documentación completa
```

## ✅ Todo está listo para...

✨ Descargar archivos Excel desde OneDrive  
📊 Mostrarlos en una tabla interactiva  
🔧 Conectar Frontend con Backend  
🐳 Desplegar con Docker  

## 🚀 Para Empezar (3 Pasos)

### 1. Asegúrate que tienes instalado

```bash
node --version    # Debe mostrar v18.x o superior
python --version  # Debe mostrar 3.9 o superior
```

Si no lo tienes: Descarga desde nodejs.org y python.org

### 2. Configura OneDrive

Edita `backend/.env`:

```ini
ONEDRIVE_URL=https://1drv.ms/x/c/b19f31b2afda8ba0/IQCxNEN3UmXBQLI_rl5VESYZAQqLNYWhB5ipHNjRt0Wprbs?e=oCO30X
```

(Reemplaza con tu URL si es diferente)

### 3. Inicia todo (elige UNA opción)

#### Opción A: Windows (Automático - RECOMENDADO)
```powershell
.\setup.bat
.\start.bat
```

#### Opción B: Mac/Linux
```bash
bash setup.sh
bash start.sh
```

#### Opción C: Manual (Ambas en terminales separadas)
```bash
# Terminal 1
cd backend
python -m venv venv
# Windows: .\venv\Scripts\Activate.ps1
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python main.py

# Terminal 2
cd frontend
npm install
npm start
```

## 📍 Después de iniciar

- **Frontend:** http://localhost:4200 (interfaz)
- **Backend:** http://localhost:8000 (API)
- **Docs:** http://localhost:8000/docs (Swagger)

Haz clic en "Descargar Información" y verás tus datos en la tabla.

## 📁 Estructura (Entiende qué va dónde)

```
📂 backend/
  ├── main.py              👈 API REST (descarga Excel)
  ├── .env                 👈 Tu URL de OneDrive
  ├── requirements.txt     👈 Dependencias Python
  └── app/                 👈 Código modularizado

📂 frontend/
  ├── src/app/
  │   ├── app.component.ts 👈 Lógica del componente
  │   ├── services/
  │   │   └── data.service.ts  👈 Conecta con backend
  │   └── app.component.html   👈 Tabla + Botón
  ├── package.json         👈 Dependencias Node
  └── angular.json         👈 Config de Angular

📄 Documentación (Lee en este orden)
  1. README_FULL.md            👈 Empieza aquí
  2. CONEXION_ONEDRIVE.md      👈 Cómo conecta todo
  3. INSTALACION_COMPLETA.md   👈 Instalación paso a paso
  4. ESTRUCTURA.md             👈 Detalles de arquitectura
```

## 🔗 ¿Cómo Conecta Todo?

```
Navegador
    ↓
Front (http://4200)
    ↓ HTTP GET /api/datos
Back (http://8000)
    ↓ HTTP GET (URL compartida)
OneDrive (Excel)
    ↓
Front recibe JSON
    ↓
Tabla se llena ✨
```

## 🛠️ Comandos Útiles

### Frontend (en carpeta `frontend`)
```bash
npm start              # Ejecutar en desarrollo
npm run build          # Compilar para producción
npm test               # Ejecutar tests
ng generate component mi-componente  # Crear componente
```

### Backend (en carpeta `backend`)
```bash
python main.py         # Ejecutar
python -m pytest       # Tests
pip install xyz        # Instalar paquete
```

## ❌ Errores Comunes

| Problema | Solución |
|----------|----------|
| "Backend no disponible" | ¿Está corriendo `python main.py`? |
| "Port 4200 in use" | Otro programa usa ese puerto, intenta `ng serve --port 4201` |
| "Port 8000 in use" | Cambia en `backend/.env` a `PORT=8001` |
| npm error | `rm -rf node_modules && npm install` |
| pip error | `pip install -r requirements.txt --user` |

## 📚 Documentación Completa

Abre estos archivos según necesites:

| Archivo | Para Qué |
|---------|----------|
| **README_FULL.md** | Visión general del proyecto |
| **CONEXION_ONEDRIVE.md** | 🔗 Cómo conectar con OneDrive |
| **INSTALACION_COMPLETA.md** | 📖 Setup paso a paso |
| **ESTRUCTURA.md** | 🏗️ Arquitectura detallada |
| **backend/README.md** | ⚙️ Documentación FastAPI |
| **frontend/README.md** | 🎨 Documentación Angular |

## 🎯 Próximos Pasos (Qué Hacer Después)

1. **Ahora:** Haz que funcione todo
   ```bash
   .\start.bat  # Windows
   bash start.sh  # Mac/Linux
   ```

2. **Luego:** Entiende la conexión
   - Lee `CONEXION_ONEDRIVE.md`
   - Abre DevTools (F12) → Network
   - Haz clic en "Descargar"

3. **Explora:** Modifica el código
   - Estilos: `frontend/src/app/app.component.css`
   - Lógica: `frontend/src/app/app.component.ts`
   - API: `backend/main.py`

4. **Mejora:** Agrega features
   - Filtros en la tabla
   - Búsqueda
   - Exportar a CSV
   - Ver ROADMAP.md para ideas

## 🤔 Preguntas Frecuentes

**P: ¿Dónde modifico la URL de OneDrive?**
R: En `backend/.env` - variable `ONEDRIVE_URL`

**P: ¿Cómo cambio el puerto?**
R: Backend en `backend/.env` → `PORT`  
Frontend: `ng serve --port XXXX`

**P: ¿Cómo agrego más columnas?**
R: Solo agrega columnas en tu Excel. El backend y frontend son automáticos.

**P: ¿Cómo despliego a internet?**
R: Ver `ESTRUCTURA.md` → Deployment

**P: ¿Cómo hago login?**
R: Ver `ROADMAP.md` → Fase 2

## 🐳 Alternativa: Usar Docker

Si tienes Docker instalado:

```bash
docker-compose up
```

Accede a:
- Frontend: http://localhost:4200
- Backend: http://localhost:8000

## 📞 ¿Necesitas Ayuda?

1. Revisa el archivo `CONEXION_ONEDRIVE.md` → Troubleshooting
2. Revisa `INSTALACION_COMPLETA.md` → Errores Comunes
3. Abre DevTools (F12) y revisa la consola

## ✨ Lo Que Incluye Este Proyecto

```
✅ Frontend Angular moderno y responsivo
✅ Backend FastAPI con Swagger docs
✅ Conexión con OneDrive
✅ Procesamiento de Excel automático
✅ Dockerfiles para ambos servicios
✅ Scripts de setup y inicio
✅ Documentación completa
✅ Tests unitarios
✅ CORS configurado
✅ Logging configurado
✅ Variables de entorno
✅ Git ignore
✅ Modelos de datos (Pydantic)
✅ Componentes standalone (Angular)
```

## 🎓 Aprender Más

- Angular: https://angular.io/docs
- FastAPI: https://fastapi.tiangolo.com/
- OneDrive API: https://docs.microsoft.com/en-us/onedrive/developer/rest-api/

## 🎉 Checklist Final

- [ ] Tengo Node.js v18+
- [ ] Tengo Python 3.9+
- [ ] Configuré `backend/.env` con mi URL
- [ ] Ejecuté `setup.bat` o `bash setup.sh`
- [ ] Ejecuté `start.bat` o `bash start.sh`
- [ ] Frontend abre en http://localhost:4200
- [ ] Backend responde en http://localhost:8000/health
- [ ] Puedo descargar datos y ver tabla
- [ ] Leí al menos README_FULL.md
- [ ] Entendí la arquitectura leyendo CONEXION_ONEDRIVE.md

## 🚀 ¡A Disfrutar!

Tu aplicación está lista. Solo necesitas:

1. **Ejecutar:** `.\start.bat` (Windows) o `bash start.sh` (Mac/Linux)
2. **Visitar:** http://localhost:4200
3. **Hacer clic:** En "Descargar Información"

¡Eso es todo! 🎉

---

**Última actualización:** Abril 2024  
**Versión:** 1.0.0  
**Estado:** ✅ Listo para usar
