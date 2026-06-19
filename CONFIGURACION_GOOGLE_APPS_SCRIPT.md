# 📝 Configuración Detallada: Google Apps Script

Guía paso a paso para crear y configurar Google Apps Script para sincronización de datos.

---

## ¿Qué es Google Apps Script?

Google Apps Script es un servicio de Google que permite ejecutar código JavaScript en los servidores de Google. Lo usamos para:

✅ **Leer** datos de Google Sheets (GET)  
✅ **Escribir** datos en Google Sheets (POST)  
✅ Sin necesidad de credenciales complejas (OAuth2)  
✅ Acceso remoto desde cualquier lugar

---

## Paso 1: Acceder a Google Apps Script

1. Abre [https://script.google.com](https://script.google.com)
2. Haz clic en **"Nuevo proyecto"**
3. Dale un nombre descriptivo, por ejemplo:
   - `InscripcionesEventosSync`
   - `EventosAPI`
   - `SincronizacionSheets`

---

## Paso 2: Pegar el Código

Cuando se abre el nuevo proyecto, verás un editor con una función `myFunction()` por defecto.

### 2.1 Limpiar el Código Anterior

Borra TODO el contenido y pega este código:

```javascript
// ====================================================================
// CONFIGURACIÓN
// ====================================================================

// Tu ID de Google Sheet (obtenido de la URL del Google Sheet)
// URL ejemplo: https://docs.google.com/spreadsheets/d/1PIQgMw0NIQ0F1vzEL8eCFENI36mKF_hcXSG49vH8Qvs/edit
// ID es la parte larga entre /d/ y /edit
const SPREADSHEET_ID = 'REEMPLAZA_CON_TU_ID';

// Contraseña/secreto para autorizar solicitudes
// Cámbialo a algo más seguro para producción
const SECRET = 'bonito10';

// ====================================================================
// FUNCIÓN PARA LEER DATOS (GET)
// ====================================================================

/**
 * Función que responde a solicitudes GET
 * Lee todos los datos del Google Sheet y los devuelve en JSON
 */
function doGet(e) {
  try {
    // Validar el secreto
    const secret = e.parameter.secret || '';
    if (secret !== SECRET) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Unauthorized - Invalid secret'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Abrir el Google Sheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getActiveSheet();
    
    // Obtener todos los datos
    const range = sheet.getDataRange();
    const values = range.getValues();

    // Si no hay datos
    if (values.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        columns: [],
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Extraer encabezados (primera fila)
    const headers = values[0];
    
    // Convertir datos a formato JSON
    // Cada fila se convierte en un objeto con claves = nombres de columnas
    const data = values.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    // Responder con éxito
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      columns: headers,
      data: data
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error en doGet: ' + error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ====================================================================
// FUNCIÓN PARA ESCRIBIR DATOS (POST)
// ====================================================================

/**
 * Función que responde a solicitudes POST
 * Escribe datos en el Google Sheet (reemplaza todo el contenido)
 */
function doPost(e) {
  try {
    // Parsear el cuerpo JSON
    const payload = JSON.parse(e.postData.contents);
    const secret = payload.secret || '';

    // Validar el secreto
    if (secret !== SECRET) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Unauthorized - Invalid secret'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Extraer columnas y datos del payload
    const columns = payload.columns || [];
    const data = payload.data || [];

    // Validar que haya datos
    if (columns.length === 0 || data.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'No columns or data provided'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Abrir el Google Sheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getActiveSheet();

    // Limpiar contenido anterior
    sheet.clearContents();

    // Escribir encabezados en la primera fila
    const headerRange = sheet.getRange(1, 1, 1, columns.length);
    headerRange.setValues([columns]);

    // Convertir datos al formato de filas para Google Sheets
    // Cada objeto se convierte en un array en el orden de las columnas
    const dataRows = data.map(item => {
      return columns.map(col => item[col] || '');
    });

    // Escribir datos si hay alguno
    if (dataRows.length > 0) {
      const dataRange = sheet.getRange(2, 1, dataRows.length, columns.length);
      dataRange.setValues(dataRows);
    }

    // Responder con éxito
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved successfully',
      rows_saved: dataRows.length
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error en doPost: ' + error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ====================================================================
// FUNCIONES AUXILIARES (OPCIONAL)
// ====================================================================

/**
 * Función de prueba para verificar que Apps Script funciona
 * Ejecuta esto desde el editor para probar
 */
function testRead() {
  const result = doGet({
    parameter: { secret: SECRET }
  });
  Logger.log(result.getContent());
}

/**
 * Función para cambiar el ID del Sheet manualmente
 * Útil si el Sheet cambia
 */
function setSpreadsheetId(newId) {
  Logger.log('Actualiza SPREADSHEET_ID a: ' + newId);
  // Nota: Debes cambiar manualmente la constante SPREADSHEET_ID arriba
}
```

---

## Paso 3: Reemplazar el ID del Google Sheet

### 3.1 Encontrar tu ID de Google Sheet

1. Abre tu Google Sheet en otra pestaña
2. Mira la URL del navegador:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_TU_ID]/edit?usp=sharing
   ```
3. Copia la parte larga entre `/d/` y `/edit`
   - Ejemplo: `1PIQgMw0NIQ0F1vzEL8eCFENI36mKF_hcXSG49vH8Qvs`

### 3.2 Actualizar el Código

En Google Apps Script, encuentra esta línea:

```javascript
const SPREADSHEET_ID = 'REEMPLAZA_CON_TU_ID';
```

Y reemplázala con:

```javascript
const SPREADSHEET_ID = '1PIQgMw0NIQ0F1vzEL8eCFENI36mKF_hcXSG49vH8Qvs';
```

Usa tu ID real, no este ejemplo.

---

## Paso 4: Cambiar la Contraseña (Opcional)

La contraseña por defecto es `bonito10`, que **NO ES SEGURA**.

Para cambiarla:

1. En Google Apps Script, encuentra:
   ```javascript
   const SECRET = 'bonito10';
   ```

2. Cámbiala a algo más fuerte, por ejemplo:
   ```javascript
   const SECRET = 'MiContraseña2024#Segura';
   ```

3. **Recuerda:** Debes usar esta misma contraseña en `backend/.env`:
   ```env
   GOOGLE_APPS_SCRIPT_SECRET=MiContraseña2024#Segura
   ```

---

## Paso 5: Guardar el Script

Haz clic en **"💾 Guardar"** o presiona **Ctrl+S**.

Se te pedirá que des permiso para que el script acceda a tu Google Sheet.

---

## Paso 6: Desplegar como Web App

Este es el paso más importante. El script debe estar disponible como una aplicación web accesible desde Internet.

### 6.1 Crear la Implementación

1. Haz clic en **"Implementar"** (esquina superior derecha)
   - Si no ves este botón, busca el ícono de engranaje ⚙️
2. Selecciona **"Nueva implementación"**
3. En el menú desplegable, selecciona **"Aplicación web"**

---

### 6.2 Configurar Permisos

En el cuadro de diálogo que aparece:

**Ejecutar como:**
- Selecciona tu cuenta de Google (la que creó el Sheet)

**Quién tiene acceso:**
- Selecciona **"Cualquiera"** (importante, de lo contrario solo tú podrás acceder)

---

### 6.3 Implementar

1. Haz clic en **"Implementar"**
2. Google te pedirá que autorices el script
3. Selecciona tu cuenta de Google
4. Haz clic en **"Avanzado"** → **"Ir a InscripcionesEventosSync (No seguro)"**
5. Haz clic en **"Permitir"**

---

### 6.4 Copiar la URL

Una vez implementado, Google te mostrará una URL. Cópiala completamente, debería verse así:

```
https://script.google.com/macros/s/AKfycbwIRVOIBdjLOZGEG5H9BKRh4Ls7y8gEUHBq23PcpXXrY80bKMBv3GAXMpVFzT5UeGlP/exec
```

Esta es tu **GOOGLE_APPS_SCRIPT_URL**.

---

## Paso 7: Configurar en el Backend

En tu proyecto, abre `backend/.env` y actualiza:

```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwIRVOIBdjLOZGEG5H9BKRh4Ls7y8gEUHBq23PcpXXrY80bKMBv3GAXMpVFzT5UeGlP/exec
GOOGLE_APPS_SCRIPT_SECRET=bonito10
GOOGLE_APPS_SCRIPT_READ=false
```

Reemplaza la URL con la tuya.

---

## Paso 8: Probar que Funciona

### 8.1 Prueba en Google Apps Script

1. En el editor de Google Apps Script, haz clic en **"▶ Ejecutar"**
2. Selecciona la función **`testRead`**
3. Presiona **"▶ Ejecutar"**
4. Abre **"Ejecución"** (abajo) para ver los resultados

Deberías ver algo como:
```json
{
  "success": true,
  "columns": ["ID", "Start time", ...],
  "data": [...]
}
```

---

### 8.2 Prueba desde curl/Terminal

Una vez que despliegues el backend, ejecuta:

```bash
# Reemplaza TU_URL con tu GOOGLE_APPS_SCRIPT_URL
curl "TU_URL?secret=bonito10"
```

Deberías recibir un JSON con los datos.

---

## Actualizar el Script Después

Si cambias el código del Apps Script:

1. Edita el código en Google Apps Script
2. Haz clic en **"Guardar"**
3. Haz clic en **"Implementar"** → **"Editar implementaciones"**
4. Selecciona la implementación anterior
5. Haz clic en el ícono de lápiz para editar
6. Haz clic en **"Actualizar"**

No necesitas cambiar la URL; la misma URL seguirá funcionando.

---

## Cambiar de Google Sheet

Si en el futuro quieres cambiar a un Google Sheet diferente:

1. Copia el ID del nuevo Sheet
2. En Google Apps Script, cambia:
   ```javascript
   const SPREADSHEET_ID = 'TU_NUEVO_ID';
   ```
3. Haz clic en **"Guardar"**
4. Haz clic en **"Implementar"** → **"Editar implementaciones"**
5. Edita y haz clic en **"Actualizar"**
6. Actualiza el `EXCEL_SOURCE_URL` en `backend/.env`

---

## Problemas Comunes

### ❌ "Authorization required"

**Causa:** No diste permiso o la URL está mal.

**Solución:**
1. Redeploy: Haz clic en **"Implementar"** → **"Editar implementaciones"**
2. Haz clic en el ícono de lápiz
3. Haz clic en **"Actualizar"**
4. Autoriza nuevamente

---

### ❌ "Spreadsheet with id does not exist"

**Causa:** El ID del Google Sheet es incorrecto.

**Solución:**
1. Verifica el ID en tu Google Sheet URL
2. Cópialo correctamente (incluyendo todos los caracteres)
3. Actualiza en Google Apps Script
4. Redeploy

---

### ❌ "TypeError: Cannot read property 'getSheets' of null"

**Causa:** El Google Sheet no existe o no tienes permisos.

**Solución:**
1. Verifica que tienes acceso al Sheet
2. Verifica que el Sheet no fue eliminado
3. Comparte el Sheet contigo mismo si es necesario

---

### ❌ "Invalid secret" al intentar cargar

**Causa:** El `GOOGLE_APPS_SCRIPT_SECRET` en `backend/.env` no coincide.

**Solución:**
1. En Google Apps Script, verifica: `const SECRET = '...'`
2. En `backend/.env`, verifica: `GOOGLE_APPS_SCRIPT_SECRET=...`
3. Deben ser idénticos (incluyendo mayúsculas/minúsculas y caracteres especiales)

---

## Seguridad

⚠️ **IMPORTANTE PARA PRODUCCIÓN:**

1. **Cambia la contraseña** de `bonito10` a algo seguro
2. **No compartas la URL** públicamente
3. **Considera OAuth2** si necesitas seguridad mayor
4. **Usa HTTPS** en tu frontend (no hemos hecho esto en desarrollo)
5. **Valida todos los datos** en el backend (ya lo hace)

---

## Referencia de Estructura de Datos

### Formato de Lectura (GET)

**Solicitud:**
```
GET https://script.google.com/macros/s/[ID]/exec?secret=bonito10
```

**Respuesta:**
```json
{
  "success": true,
  "columns": ["ID", "Email", "Name", ...],
  "data": [
    {"ID": 1, "Email": "user@example.com", "Name": "Juan"},
    {"ID": 2, "Email": "user2@example.com", "Name": "María"},
    ...
  ]
}
```

---

### Formato de Escritura (POST)

**Solicitud:**
```json
{
  "secret": "bonito10",
  "columns": ["ID", "Email", "Name", ...],
  "data": [
    {"ID": 1, "Email": "user@example.com", "Name": "Juan"},
    {"ID": 2, "Email": "user2@example.com", "Name": "María"},
    ...
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Data saved successfully",
  "rows_saved": 2
}
```

---

## Debugging

### Ver Logs

En Google Apps Script:
1. Haz clic en **"Ejecución"** (abajo de la pantalla)
2. Verás todos los logs de las funciones que has ejecutado

### Agregar Logs a Tu Código

Si necesitas debuggear, agrega:

```javascript
Logger.log('Valor de variable: ' + variable);
```

Luego ejecuta y mira en la sección "Ejecución".

---

**Versión:** 3.0.0  
**Última actualización:** 2026-06-17
