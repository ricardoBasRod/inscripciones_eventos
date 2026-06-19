# 📋 Guía Completa: Instalación en Nueva Máquina

Esta guía paso a paso te permitirá configurar el proyecto **Gestión de Eventos - Inscripciones** desde cero en una computadora nueva y usando un archivo diferente de Google Drive.

**Tiempo estimado:** 30-45 minutos (dependiendo de la velocidad de descarga)

---

## 📋 Tabla de Contenidos

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Paso 1: Instalación de Herramientas Necesarias](#paso-1-instalación-de-herramientas-necesarias)
3. [Paso 2: Preparación del Google Drive](#paso-2-preparación-del-google-drive)
4. [Paso 3: Configuración de Google Apps Script](#paso-3-configuración-de-google-apps-script)
5. [Paso 4: Descargar el Proyecto](#paso-4-descargar-el-proyecto)
6. [Paso 5: Configurar Variables de Entorno](#paso-5-configurar-variables-de-entorno)
7. [Paso 6: Instalar Dependencias](#paso-6-instalar-dependencias)
8. [Paso 7: Ejecutar la Aplicación](#paso-7-ejecutar-la-aplicación)
9. [Paso 8: Cargar el Archivo Excel](#paso-8-cargar-el-archivo-excel)
10. [Solución de Problemas](#solución-de-problemas)

---

## 🖥️ Requisitos del Sistema

Tu computadora debe cumplir con:

- **Sistema Operativo:** Windows 10+, macOS 10.14+, o Linux
- **Memoria RAM:** Mínimo 4GB (8GB recomendado)
- **Espacio en disco:** 2GB disponibles
- **Conexión a Internet:** Requerida para Google Drive, Google Sheets y descargas

---

## Paso 1: Instalación de Herramientas Necesarias

### 1.1 Instalar Git

Git es necesario para descargar el código del proyecto.

**Windows:**
1. Descarga desde [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Ejecuta el instalador y acepta todas las opciones por defecto
3. Abre PowerShell o CMD y verifica:
   ```bash
   git --version
   ```

**macOS:**
```bash
brew install git
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install git
```

---

### 1.2 Instalar Node.js y npm

Node.js incluye npm automáticamente.

**Windows y macOS:**
1. Descarga desde [https://nodejs.org/](https://nodejs.org/)
2. Instala la versión LTS (Long Term Support)
3. Durante la instalación, marca la opción "Add to PATH"
4. Reinicia tu computadora
5. Abre CMD/PowerShell/Terminal y verifica:
   ```bash
   node --version
   npm --version
   ```
   Deberías ver versiones similares a: v20.x.x y 10.x.x

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs
```

---

### 1.3 Instalar Docker (Opcional pero Recomendado)

Docker permite ejecutar el backend en un contenedor sin instalar Python manualmente.

**Windows:**
1. Descarga [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop)
2. Ejecuta el instalador
3. Reinicia tu computadora
4. Verifica en PowerShell:
   ```bash
   docker --version
   docker-compose --version
   ```

**macOS:**
```bash
brew install docker
brew install docker-compose
```

**Linux:**
```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER
# Cierra y abre de nuevo la terminal
```

---

### 1.4 (Alternativa a Docker) Instalar Python

Si **NO** usas Docker, instala Python:

**Windows:**
1. Descarga desde [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. Asegúrate de marcar "Add Python to PATH" durante la instalación
3. Verifica en CMD:
   ```bash
   python --version
   ```
   Debe ser Python 3.9+

**macOS:**
```bash
brew install python3
```

**Linux:**
```bash
sudo apt install python3 python3-pip python3-venv
```

---

## Paso 2: Preparación del Google Drive

### 2.1 Crear la Carpeta en Google Drive

1. Abre [Google Drive](https://drive.google.com)
2. Haz clic derecho en el espacio en blanco
3. Selecciona **"Nueva carpeta"**
4. Nombra la carpeta: `Inscripciones_Eventos` (o el nombre que prefieras)
5. Abre la carpeta

---

### 2.2 Crear el Archivo Google Sheets

1. Dentro de la carpeta, haz clic derecho → **"Más"** → **"Google Sheets"** → **"Crear hojas de cálculo en blanco"**
2. Nombra la hoja: `Registros_Inscripciones`
3. Abre la hoja

---

### 2.3 Crear la Estructura de Columnas

En la primera fila, crea estas columnas exactamente como se muestra:

| A | B | C | D | E | F | ... |
|---|---|---|---|---|---|-----|
| ID | Start time | Completion time | Email | Name | Last modified time | ... |

**Columnas requeridas (en este orden):**

1. `ID` - Identificador único
2. `Start time` - Fecha/hora de inicio
3. `Completion time` - Fecha/hora de finalización
4. `Email` - Correo electrónico
5. `Name` - Nombre
6. `Last modified time` - Última modificación
7. Las siguientes 12 columnas según tu formulario Google Forms (si aplica)

**Nota:** Si usas un formulario de Google Forms existente, puedes hacer clic en **"Vincular a formulario"** en Google Sheets para que se cree automáticamente.

---

### 2.4 Obtener el ID de la Hoja

1. En tu Google Sheet, mira la URL del navegador:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_TU_ID]/edit?usp=sharing
   ```
2. Copia el ID (la parte larga entre `/d/` y `/edit`)
3. **Guarda este ID**, lo necesitarás en el paso 5

---

### 2.5 Hacer la Hoja Pública (Lectura)

1. En tu Google Sheet, haz clic en **"Compartir"** (arriba a la derecha)
2. En el cuadro de diálogo, cambia el acceso a **"Cualquiera con el enlace"**
3. Asegúrate que sea "Visualizador" (solo lectura)
4. Copia el enlace compartido, debería verse así:
   ```
   https://docs.google.com/spreadsheets/d/[TU_ID]/edit?usp=sharing
   ```

---

## Paso 3: Configuración de Google Apps Script

Google Apps Script permite que el frontend escriba datos en Google Sheets sin credenciales complejas.

### 3.1 Crear el Script en Google Apps Script

1. Abre [script.google.com](https://script.google.com)
2. Haz clic en **"Nuevo proyecto"**
3. Dale un nombre: `InscripcionesEventosSync`
4. Borra el contenido por defecto y pega este código:

```javascript
// ID de tu Google Sheet (obtenido en paso 2.4)
const SPREADSHEET_ID = 'PEGA_TU_ID_AQUI';
const SECRET = 'bonito10'; // Cambia esto por una contraseña segura

function doGet(e) {
  try {
    const secret = e.parameter.secret || '';
    if (secret !== SECRET) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Unauthorized'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getActiveSheet();
    const range = sheet.getDataRange();
    const values = range.getValues();

    if (values.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        columns: [],
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const headers = values[0];
    const data = values.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      columns: headers,
      data: data
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const secret = payload.secret || '';

    if (secret !== SECRET) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Unauthorized'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const columns = payload.columns || [];
    const data = payload.data || [];

    if (columns.length === 0 || data.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'No columns or data provided'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getActiveSheet();

    // Limpiar hojas anteriores
    sheet.clearContents();

    // Escribir encabezados
    const headerRange = sheet.getRange(1, 1, 1, columns.length);
    headerRange.setValues([columns]);

    // Escribir datos
    const dataRows = data.map(item => {
      return columns.map(col => item[col] || '');
    });

    if (dataRows.length > 0) {
      const dataRange = sheet.getRange(2, 1, dataRows.length, columns.length);
      dataRange.setValues(dataRows);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

### 3.2 Reemplazar el ID

En el código anterior, encuentra esta línea:
```javascript
const SPREADSHEET_ID = 'PEGA_TU_ID_AQUI';
```

Y reemplaza `'PEGA_TU_ID_AQUI'` con el ID que guardaste en el paso 2.4.

Por ejemplo:
```javascript
const SPREADSHEET_ID = '1PIQgMw0NIQ0F1vzEL8eCFENI36mKF_hcXSG49vH8Qvs';
```

---

### 3.3 Desplegar el Script

1. Haz clic en **"Implementar"** (arriba a la derecha)
2. Selecciona **"Nueva implementación"**
3. En el menú desplegable, selecciona **"Aplicación web"**
4. En "Ejecutar como", selecciona tu cuenta de Google
5. En "Quién tiene acceso", selecciona **"Cualquiera"**
6. Haz clic en **"Implementar"**
7. Una ventana emergente mostrará un enlace. **Copia esta URL completamente**
   - Debería verse así: `https://script.google.com/macros/s/[CODIGO]/exec`

**Guarda esta URL**, la necesitarás en el paso 5.

---

### 3.4 (Opcional) Cambiar la Contraseña

En el código de Google Apps Script, hay esta línea:
```javascript
const SECRET = 'bonito10';
```

Puedes cambiar `'bonito10'` por la contraseña que desees. Luego debes:
1. Haz clic en **"Implementar"** nuevamente
2. Selecciona la implementación existente
3. Haz clic en el icono de lápiz para editar
4. Asegúrate de cambiar tanto en el código de lectura como en el de escritura
5. Haz clic en **"Actualizar"**

---

## Paso 4: Descargar el Proyecto

### 4.1 Selecciona una Carpeta para el Proyecto

En Windows:
```bash
mkdir C:\Proyectos
cd C:\Proyectos
```

En macOS/Linux:
```bash
mkdir ~/Proyectos
cd ~/Proyectos
```

### 4.2 Clonar el Repositorio

Si tienes acceso a Git:
```bash
git clone https://github.com/tu-usuario/inscripciones_eventos.git
cd inscripciones_eventos
```

O, si no tienes acceso al repositorio, descarga los archivos y colócalos en una carpeta llamada `inscripciones_eventos`.

### 4.3 Verificar la Estructura

La carpeta debe tener esta estructura:

```
inscripciones_eventos/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models.py
│   │   └── utils.py
│   ├── .env
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── index.html
│   │   └── main.ts
│   ├── package.json
│   ├── angular.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Paso 5: Configurar Variables de Entorno

### 5.1 Abrir el Archivo .env del Backend

Abre el archivo `backend/.env` con tu editor de texto favorito (Notepad, VS Code, etc.)

---

### 5.2 Actualizar las Configuraciones

Reemplaza el contenido actual con esto (actualiza los valores):

```env
# Google Sheets
EXCEL_SOURCE_URL=https://docs.google.com/spreadsheets/d/[TU_ID]/edit?usp=sharing
EXCEL_SHEET_NAME=
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/[TU_CODIGO]/exec
GOOGLE_APPS_SCRIPT_SECRET=bonito10
GOOGLE_APPS_SCRIPT_READ=false

# Backend
DEBUG=True
HOST=0.0.0.0
PORT=8000

# Frontend
FRONTEND_URL=http://localhost:4200
```

**Reemplaza:**
- `[TU_ID]` → El ID de tu Google Sheet (paso 2.4)
- `[TU_CODIGO]` → El código del Apps Script (paso 3.3)
- `bonito10` → La contraseña que estableciste (paso 3.4)

---

### 5.3 Guardar el Archivo

Presiona **Ctrl+S** (o Cmd+S en Mac) para guardar.

---

## Paso 6: Instalar Dependencias

### 6.1 Instalar Dependencias del Frontend

```bash
cd inscripciones_eventos/frontend
npm install
```

Este proceso puede tomar 2-5 minutos. Espera a que termine.

---

### 6.2 Instalar Dependencias del Backend (si NO usas Docker)

Si usas Docker, salta este paso.

```bash
cd ../backend
python -m venv venv
```

**Windows:**
```bash
venv\Scripts\activate
pip install -r requirements.txt
```

**macOS/Linux:**
```bash
source venv/bin/activate
pip install -r requirements.txt
```

---

## Paso 7: Ejecutar la Aplicación

### Opción A: Con Docker (Recomendado)

En la raíz del proyecto (`inscripciones_eventos/`):

```bash
docker-compose up --build
```

Este comando:
1. Descarga las imágenes necesarias (puede tomar 5-10 minutos la primera vez)
2. Crea los contenedores
3. Ejecuta el backend en `http://localhost:8000`
4. Ejecuta el frontend en `http://localhost:4200`

Espera hasta ver algo como:
```
backend    | INFO:     Application startup complete [uvicorn]
frontend   | ✔ browser application bundle
```

---

### Opción B: Sin Docker (Desarrollo)

**Terminal 1 - Backend:**

```bash
cd inscripciones_eventos/backend

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

python main.py
```

Deberías ver:
```
INFO:     Application startup complete [uvicorn]
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Frontend:**

```bash
cd inscripciones_eventos/frontend
npm start
```

Esto abrirá automáticamente `http://localhost:4200` en tu navegador.

---

## Paso 8: Cargar el Archivo Excel

### 8.1 Preparar el Archivo Excel

Crea un archivo Excel con las siguientes columnas en el mismo orden que tu Google Sheet:

- ID
- Start time
- Completion time
- Email
- Name
- Last modified time
- (Y todas las demás columnas de tu formulario)

### 8.2 Cargar en la Aplicación

1. Abre `http://localhost:4200` en tu navegador
2. Haz clic en el botón **"Cargar"**
3. Selecciona tu archivo Excel
4. La aplicación validará el formato
5. Si todo es correcto, los datos se cargarán en Google Sheets

---

## Verificación Final

### ✅ Checklist de Verificación

- [ ] El frontend se abre en `http://localhost:4200`
- [ ] El backend responde en `http://localhost:8000` (prueba accediendo a `http://localhost:8000/health`)
- [ ] Puedes ver la tabla de datos vacía o con datos previos
- [ ] El buscador de nombre/matrícula funciona
- [ ] El buscador de cursos funciona
- [ ] El botón "Descargar Excel" descarga un archivo
- [ ] El botón "Cargar" permite subir un archivo Excel

---

## Solución de Problemas

### ❌ Error: "El formato del archivo no coincide"

**Causa:** Las columnas del Excel no coinciden exactamente con las de Google Sheets.

**Solución:**
1. Verifica que los nombres de las columnas sean exactos (mayúsculas/minúsculas/espacios)
2. Asegúrate que estén en el mismo orden
3. Revisa si hay caracteres especiales o acentos no esperados

---

### ❌ Error: "Falta EXCEL_SOURCE_URL"

**Causa:** El archivo `.env` no está configurado correctamente.

**Solución:**
1. Abre `backend/.env`
2. Verifica que `EXCEL_SOURCE_URL` no esté vacío
3. Asegúrate que sea una URL válida de Google Sheets

---

### ❌ Error: "No se pudo guardar en Google Sheets"

**Causa:** La URL de Google Apps Script o el SECRET son incorrectos.

**Solución:**
1. Verifica en `backend/.env`:
   - `GOOGLE_APPS_SCRIPT_URL` debe ser exactamente igual a la URL de tu script (paso 3.3)
   - `GOOGLE_APPS_SCRIPT_SECRET` debe coincidir con el que pusiste en el código de Apps Script
2. Si cambiaste el SECRET en Apps Script, debes hacer una nueva implementación (paso 3.3)

---

### ❌ Error: "Conexión rechazada en localhost:8000"

**Causa:** El backend no está corriendo.

**Solución:**
1. Verifica que ejecutaste `docker-compose up --build` o `python main.py`
2. Asegúrate de no tener otro programa usando el puerto 8000
3. Si usas Windows y Docker, verifica que Docker Desktop esté abierto

---

### ❌ Error: "ERR_EMPTY_RESPONSE" o timeout

**Causa:** Problema de conexión entre frontend y backend.

**Solución:**
1. Verifica que ambos estén corriendo:
   - Backend: `http://localhost:8000/health`
   - Frontend: `http://localhost:4200`
2. En Windows, si usas Docker, verifica que Docker Desktop esté ejecutándose
3. Abre las herramientas de desarrollador del navegador (F12) y revisa la consola

---

### ❌ Error: "Node: command not found" o "npm: command not found"

**Causa:** Node.js no está instalado o no está en el PATH.

**Solución:**
1. Instala Node.js desde [nodejs.org](https://nodejs.org/)
2. **Reinicia tu computadora completamente**
3. Abre una nueva terminal (no reutilices la anterior)
4. Verifica: `node --version`

---

### ❌ Error: "Python: command not found"

**Causa:** Python no está instalado o no está en el PATH.

**Solución:**
1. Instala Python desde [python.org](https://python.org/)
2. Durante la instalación, marca **"Add Python to PATH"**
3. **Reinicia tu computadora**
4. Verifica: `python --version`

---

### ❌ Error: "Docker: command not found"

**Causa:** Docker no está instalado.

**Solución:**
1. Instala Docker Desktop desde [docker.com](https://www.docker.com/products/docker-desktop/)
2. Reinicia tu computadora
3. Verifica que Docker Desktop se abre automáticamente en el sistema

---

### ❌ La tabla no muestra datos

**Causa:** Google Sheets está vacío o la conexión falla.

**Solución:**
1. Agrega datos manualmente a tu Google Sheet
2. Verifica la URL en `backend/.env` apuntando al Sheet correcto
3. Abre el navegador en `http://localhost:8000/health` para ver si el backend puede acceder a Google Sheets

---

## 🎓 Próximos Pasos (Opcional)

### Agregar Más Campos
1. Edita tu Google Sheet y agrega nuevas columnas
2. Actualiza el archivo Excel de prueba con las nuevas columnas
3. Carga el nuevo archivo mediante la interfaz

### Configurar HTTPS (Producción)
Si planeas desplegar a producción, necesitarás configurar certificados SSL/TLS.

### Hacer Backup
Regularmente haz backup de:
- Tu Google Sheet (Descarga como Excel)
- Tu carpeta del proyecto (usando Git)

---

## 📞 Preguntas Frecuentes

**P: ¿Necesito hacer todo esto cada vez que reinicio mi computadora?**
R: No. Solo necesitas ejecutar `docker-compose up` (o `python main.py` y `npm start`) cada vez que quieras usar la aplicación.

**P: ¿Puedo usar otro archivo de Excel en lugar de Google Sheets?**
R: No. La aplicación está diseñada específicamente para Google Sheets y Google Apps Script para facilitar el acceso remoto y las actualizaciones en tiempo real.

**P: ¿Qué pasa si quiero cambiar el archivo de Google Sheets?**
R: Simplemente actualiza `EXCEL_SOURCE_URL` en `backend/.env` y redeploy el Apps Script con el nuevo ID de Sheet.

**P: ¿Es seguro usar `GOOGLE_APPS_SCRIPT_SECRET=bonito10`?**
R: No. Para producción, cambia esto a una contraseña fuerte y única. Mantén esta contraseña segura.

**P: ¿Dónde se guardan los datos?**
R: Todos los datos se guardan en tu Google Sheet. El backend no tiene base de datos local (sin Docker) o un volumen Docker que persiste entre reinicios.

---

## 🎉 ¡Éxito!

Si has seguido todos los pasos, tu aplicación está lista. Abre `http://localhost:4200` y comienza a usar Gestión de Eventos.

Para cualquier problema, revisa la sección "Solución de Problemas" o consulta con tu equipo técnico.

---

**Última actualización:** 2026-06-17
**Versión del proyecto:** 3.0.0
