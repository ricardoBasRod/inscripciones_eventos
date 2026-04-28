# 📌 Guía Completa: Conectar con OneDrive

Esta guía te explica exactamente qué necesitas para conectar tu archivo de Excel en OneDrive con la aplicación.

## 🎯 Lo que tienes

✅ **URL del archivo compartido:**
```
https://1drv.ms/x/c/b19f31b2afda8ba0/IQCxNEN3UmXBQLI_rl5VESYZAQqLNYWhB5ipHNjRt0Wprbs?e=oCO30X
```

✅ **Archivo Excel con:**
- Columna: `id`
- Columna: `nombre`
- 4 registros de datos

## ⚙️ Configuración Requerida

### 1. **Backend (FastAPI)**

El backend ya está configurado para:
- Descargar archivos desde OneDrive
- Convertir URLs compartidas a URLs de descarga directa
- Procesar Excel y retornar JSON
- Servir datos mediante API REST

**Archivo de configuración:**
```
backend/.env
```

### 2. **Frontend (Angular)**

El frontend ya está configurado para:
- Conectarse al backend en `http://localhost:8000`
- Solicitar datos del endpoint `/api/datos`
- Mostrar datos en la tabla

**Archivo de configuración:**
```
src/app/services/data.service.ts
```

## 🚀 Pasos para Conectar

### Paso 1: Asegurar que el archivo está compartido públicamente en OneDrive

1. Ve a https://onedrive.live.com
2. Encuentra tu archivo Excel
3. Click derecho → "Compartir"
4. Elige "Acceso a cualquiera con el enlace"
5. Copia el enlace

### Paso 2: Configurar el Backend

```bash
# 1. Ir a carpeta backend
cd backend

# 2. Crear archivo .env (si no existe)
cp .env.example .env

# 3. Editar .env y agregar tu URL
# ONEDRIVE_URL=https://1drv.ms/x/c/...
```

**Contenido del .env:**
```ini
ONEDRIVE_URL=https://1drv.ms/x/c/b19f31b2afda8ba0/IQCxNEN3UmXBQLI_rl5VESYZAQqLNYWhB5ipHNjRt0Wprbs?e=oCO30X
DEBUG=True
HOST=0.0.0.0
PORT=8000
FRONTEND_URL=http://localhost:4200
```

### Paso 3: Instalar dependencias del Backend

```bash
# En Windows
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# En Mac/Linux
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Paso 4: Ejecutar el Backend

```bash
python main.py
```

Deberías ver:
```
INFO:     Application startup complete
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Paso 5: Verificar que el Backend funciona

Abre en tu navegador:
```
http://localhost:8000/health
```

Deberías ver:
```json
{"status": "healthy"}
```

### Paso 6: Ver los datos

Abre en tu navegador:
```
http://localhost:8000/api/datos
```

Deberías ver algo así:
```json
{
  "success": true,
  "total": 4,
  "columns": ["id", "nombre"],
  "data": [
    {"id": 1, "nombre": "Dato 1"},
    {"id": 2, "nombre": "Dato 2"},
    {"id": 3, "nombre": "Dato 3"},
    {"id": 4, "nombre": "Dato 4"}
  ]
}
```

### Paso 7: Ejecutar el Frontend (en otra terminal)

```bash
# En otra terminal/ventana
cd frontend
npm install
npm start
```

### Paso 8: Usar la aplicación

1. Abre http://localhost:4200
2. Haz click en "Descargar Información"
3. Los datos aparecerán en la tabla

## 🔗 Estructura de Conexión

```
┌─────────────────────────┐
│   Browser              │
│   (http://localhost:4200)│
└────────────┬────────────┘
             │
             │ HTTP Request
             ▼
┌─────────────────────────┐
│   Frontend Angular      │
│   app.component.ts      │
└────────────┬────────────┘
             │
             │ HTTP GET /api/datos
             ▼
┌─────────────────────────┐
│   Backend FastAPI       │
│   main.py               │
│   (localhost:8000)      │
└────────────┬────────────┘
             │
             │ HTTP Download (OneDrive)
             ▼
┌─────────────────────────┐
│   OneDrive Cloud        │
│   archivo.xlsx          │
└─────────────────────────┘
```

## 🧪 Probar Cada Componente

### Prueba 1: ¿Backend está corriendo?
```bash
curl http://localhost:8000/health
```
Deberías ver: `{"status":"healthy"}`

### Prueba 2: ¿Backend puede descargar de OneDrive?
```bash
curl http://localhost:8000/api/datos
```
Deberías ver JSON con tus datos

### Prueba 3: ¿Frontend se conecta al backend?
Abre: `http://localhost:4200`
Abre DevTools (F12)
Haz click en "Descargar Información"
Verifica en la pestaña "Network" que se llamó a `localhost:8000/api/datos`

## 🔧 Configuración Avanzada

### Cambiar el puerto del Backend

En `backend/.env`:
```ini
PORT=8001
```

Luego actualizar en `frontend/src/app/services/data.service.ts`:
```typescript
private apiUrl = 'http://localhost:8001/api';
```

### Agregar más URLs de OneDrive

En el Frontend, puedes cargar datos de diferentes archivos:

```typescript
// En app.component.ts
descargarDatosPersonalizados(url: string): void {
  this.dataService.cargarDesdeUrlPersonalizada(url).subscribe({
    next: (response) => {
      this.tableData = response.data;
      // ...
    }
  });
}
```

### Usar Postman para probar

1. Descarga [Postman](https://www.postman.com/)
2. Importa estas rutas:

**GET** - Health Check
```
http://localhost:8000/health
```

**GET** - Obtener Datos
```
http://localhost:8000/api/datos
```

**GET** - Obtener Columnas
```
http://localhost:8000/api/columnas
```

**POST** - Cargar desde URL personalizada
```
http://localhost:8000/api/datos/upload

Body (JSON):
{
  "file_url": "https://1drv.ms/x/c/.../file.xlsx?e=xxxxx"
}
```

## ❌ Solución de Problemas

### Problema 1: "Backend no disponible"

**Error en el navegador:**
```
Backend no disponible
```

**Solución:**
1. Verifica que está corriendo: `python main.py`
2. Verifica que está en el puerto 8000
3. Verifica CORS en `backend/main.py`

### Problema 2: "Error al conectar con OneDrive"

**Error:**
```json
{"detail": "Error al descargar datos: ..."}
```

**Solución:**
1. Verifica que la URL es correcta en `.env`
2. Verifica que el archivo está compartido públicamente
3. Intenta descargar la URL manualmente en el navegador

### Problema 3: CORS Error

**Error en el navegador:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solución:**
Verifica que `FRONTEND_URL` en `backend/.env` es correcto:
```ini
FRONTEND_URL=http://localhost:4200
```

### Problema 4: Excel no se lee correctamente

**Error:**
```json
{"detail": "Error al procesar archivo: ..."}
```

**Soluciones:**
1. Verifica que el archivo es realmente Excel (.xlsx o .xls)
2. Verifica que las columnas tienen encabezados
3. Intenta con un archivo Excel simple primero

## 📊 Verificar que Todo Funciona

Ejecuta este script bash para verificar:

```bash
#!/bin/bash

echo "1. Verificando Backend..."
curl -s http://localhost:8000/health | jq .

echo -e "\n2. Verificando datos..."
curl -s http://localhost:8000/api/datos | jq .total

echo -e "\n3. Verificando Frontend..."
curl -s http://localhost:4200 | head -n 5

echo -e "\n✅ Todos los servicios están activos"
```

## 📞 Próximos Pasos

1. ✅ Backend descargando datos de OneDrive
2. ✅ Frontend mostrando datos en tabla
3. ⬜ Agregar filtros y búsqueda
4. ⬜ Exportar a CSV/PDF
5. ⬜ Autenticación con Microsoft 365

---

**¿Necesitas ayuda?** Revisa los READMEs en cada carpeta:
- `frontend/README.md` - Documentación del frontend
- `backend/README.md` - Documentación del backend
