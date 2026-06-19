# 📊 Guía de Estructura de Datos y Formato Excel

Esta guía explica exactamente qué estructura deben tener tus datos en Excel y Google Sheets.

---

## Columnas Requeridas

El sistema espera **exactamente estas columnas en este orden**:

| # | Nombre | Tipo | Descripción | Ejemplo |
|---|--------|------|-------------|---------|
| 1 | `ID` | Número | Identificador único | `1`, `2`, `3` |
| 2 | `Start time` | Fecha/Hora | Cuándo se inició el formulario | `2026-06-17 10:30:00` |
| 3 | `Completion time` | Fecha/Hora | Cuándo se completó | `2026-06-17 10:45:00` |
| 4 | `Email` | Texto | Correo electrónico | `usuario@example.com` |
| 5 | `Name` | Texto | Nombre completo | `Juan Pérez` |
| 6 | `Last modified time` | Fecha/Hora | Última modificación | `2026-06-17 10:45:00` |
| 7+ | Columnas adicionales | Texto | Preguntas del formulario | Depende de tu formulario |

---

## Estructura Completa (Ejemplo Real)

### Columnas del Formulario Google Forms

Si usas Google Forms con estas preguntas:

```
1. ¿Eres estudiante o colaborador del Tec?
2. ¿Cuál de las siguientes opciones te identifica mejor?
3. ¿En qué curso, taller o webinar te quieres inscribir?
4. ¿Tienes conocimiento previo de CAD?
5. ¿Tienes conocimiento previo de CAE?
6. ¿De qué carrera eres?
7. He leído y acepto
```

### Headers Completos

Tu Google Sheet tendrá estas columnas (7 automáticas + 12 del formulario):

```
A: ID
B: Start time
C: Completion time
D: Email
E: Name
F: Last modified time
G: El objetivo de estos webinars es dar una introducción del uso del software...
H: Número de matrícula o nómina
I: Nombre completo del estudiante o colaborador del Tec
J: Correo electrónico del alumno o colaborador del Tec
K: Este curso está organizado exclusivamente para la comunidad Tec...
L: Cuál de la siguientes opciones te identifica mejor?
M: En qué curso, taller o webinar te quieres inscribir?
N: Tienes conocimiento previo de uso de ese u otros softwares de CAD...
O: Tienes conocimiento previo de uso de ese u otros softwares de CAE...
P: De qué carrera eres o apoyas?
Q: Cuando mandes la inscripción debes estar al tanto de...
R: He leído la información anterior y si quiero realizar mi inscripción...
```

---

## Formato de Archivo Excel

### Cómo Crear el Excel Base

1. Abre Microsoft Excel o LibreOffice Calc
2. En la **primera fila** (Header), escribe los nombres de las columnas
3. A partir de la **segunda fila**, coloca los datos

### Ejemplo de Excel Válido

```
┌────┬───────────────────────┬──────────────────────┬──────────────────────┬────────────────┐
│ ID │      Start time       │   Completion time    │       Email          │     Name       │
├────┼───────────────────────┼──────────────────────┼──────────────────────┼────────────────┤
│ 1  │ 2026-06-17 10:30:00   │ 2026-06-17 10:45:00  │ juan@example.com     │ Juan Pérez     │
├────┼───────────────────────┼──────────────────────┼──────────────────────┼────────────────┤
│ 2  │ 2026-06-17 11:00:00   │ 2026-06-17 11:15:00  │ maria@example.com    │ María López    │
├────┼───────────────────────┼──────────────────────┼──────────────────────┼────────────────┤
│ 3  │ 2026-06-17 11:30:00   │ 2026-06-17 11:45:00  │ carlos@example.com   │ Carlos García  │
└────┴───────────────────────┴──────────────────────┴──────────────────────┴────────────────┘
```

---

## Cómo Crear Tu Primer Google Sheet

### Opción A: Con Google Forms (Recomendado)

1. Abre [Google Forms](https://forms.google.com)
2. Crea un nuevo formulario
3. Agrega tus preguntas
4. Una vez completado, haz clic en la pestaña **"Respuestas"**
5. Haz clic en el ícono de Google Sheets (arriba a la izquierda)
6. Selecciona **"Crear una hoja de cálculo"**
7. Google creará automáticamente un Sheet con la estructura correcta

**Ventaja:** Las columnas se crean automáticamente cuando recibes respuestas.

---

### Opción B: Manual en Google Sheets

1. Abre [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. En la primera fila, escribe los header (columnas) exactamente como se muestran arriba
4. Luego puedes llenarla con datos manualmente o importar desde Excel

---

## Cómo Exportar Datos de Google Sheets a Excel

### Opción 1: En Google Sheets

1. Abre tu Google Sheet
2. Haz clic en **"Archivo"** (arriba a la izquierda)
3. Selecciona **"Descargar"** → **"Microsoft Excel (.xlsx)"**
4. El archivo se descargará a tu carpeta de descargas

### Opción 2: Usar la Aplicación

1. En la aplicación (http://localhost:4200)
2. Haz clic en **"Descargar Excel"**
3. Se descargará automáticamente

---

## Validación de Datos

La aplicación valida que:

### ✅ Se Valida Correctamente

```
Nombres de columnas iguales
Número de columnas igual
Orden de columnas igual
Datos pueden estar vacíos
Espacios al inicio/final no importan
Acentos y mayúsculas en datos no importan
```

### ❌ Se Rechaza Si

```
Faltan columnas
Hay columnas extra
Columnas en diferente orden
Nombres de columna con espacios especiales conflictivos
El archivo no es .xlsx o .xls
El archivo está vacío
```

---

## Cómo Cargar Datos por Archivo Excel

### Paso 1: Preparar el Excel

1. Crea un Excel con **exactamente las mismas columnas** que tu Google Sheet
2. Asegúrate que el **orden sea idéntico**
3. Llena los datos (filas 2 en adelante)
4. Guarda el archivo como `.xlsx` o `.xls`

### Ejemplo de Estructura

**Google Sheet tiene:**
```
Columnas: ID | Start time | Completion time | Email | Name | Last modified time | ...
```

**Tu Excel debe tener:**
```
Columnas: ID | Start time | Completion time | Email | Name | Last modified time | ...
```

**No** puede ser:
```
❌ Start time | ID | Completion time | Email | Name | ... (orden diferente)
❌ ID | Email | Completion time | Start time | ... (orden diferente)
❌ ID | Time start | Completion time | Email | ... (nombre diferente)
```

---

### Paso 2: Cargar en la Aplicación

1. Abre http://localhost:4200
2. Haz clic en **"Cargar"**
3. Selecciona tu archivo Excel
4. Presiona **"Abrir"**
5. La aplicación verificará el formato
6. Si es correcto: ✅ Los datos se guardan en Google Sheets
7. Si es incorrecto: ❌ Verás un mensaje de error

---

## Mensajes de Error Comunes

### ❌ "El formato del archivo no coincide"

**Significa:** Las columnas no son exactamente iguales.

**Cómo arreglarlo:**
1. Abre tu Google Sheet
2. Copia todos los header (primera fila)
3. Abre tu Excel
4. Reemplaza los header con los del Google Sheet (copia-pega)
5. Verifica que estén en el **mismo orden**
6. Guarda y vuelve a intentar

---

### ❌ "El archivo Excel está vacío"

**Significa:** El Excel no tiene datos.

**Cómo arreglarlo:**
1. Asegúrate de agregar al menos una fila de datos (fila 2)
2. Guarda el archivo
3. Intenta cargar nuevamente

---

### ❌ "El archivo debe ser Excel (.xlsx o .xls)"

**Significa:** El archivo no es Excel.

**Cómo arreglarlo:**
1. Asegúrate que el archivo termina en `.xlsx` o `.xls`
2. Si es CSV, abre en Excel y guarda como `.xlsx`
3. Si es ODS, abre en Excel y guarda como `.xlsx`

---

## Buscadores en la Aplicación

### Buscador de Nombre/Matrícula

- Busca en columnas que contengan "nombre" o "matrícula"
- **No es case sensitive** (mayúsculas no importan)
- **Sin acentos** (á, é, í, ó, ú se tratan como a, e, i, o, u)
- **Búsqueda parcial** (escribe "jua" para encontrar "Juan")

### Buscador de Curso

- Busca en columnas que contengan "curso", "taller" o "webinar"
- **No es case sensitive**
- **Sin acentos**
- **Búsqueda parcial**

### Combinación de Filtros

- Puedes usar ambos buscadores simultáneamente
- Los resultados mostrarán solo filas que coincidan con **AMBOS** filtros

---

## Ejemplos de Búsqueda

### Ejemplo 1: Buscar por nombre

```
Tabla tiene:
- Juan Pérez
- María López
- Carlos García

Buscar: "jua" 
Resultado: ✅ Juan Pérez

Buscar: "JUA"
Resultado: ✅ Juan Pérez (no es case sensitive)

Buscar: "juan perez"
Resultado: ✅ Juan Pérez

Buscar: "pérez"
Resultado: ✅ Juan Pérez

Buscar: "peres" (sin acento)
Resultado: ✅ Juan Pérez (sin acentos)
```

---

### Ejemplo 2: Buscar por curso

```
Tabla tiene:
- SOLIDWORKS CAD
- AutoCAD Básico
- SolidWorks CAE

Buscar: "solidworks"
Resultado: ✅ SOLIDWORKS CAD, SolidWorks CAE

Buscar: "SOLIDWORKS"
Resultado: ✅ SOLIDWORKS CAD, SolidWorks CAE

Buscar: "cad"
Resultado: ✅ SOLIDWORKS CAD, AutoCAD Básico

Buscar: "CAD"
Resultado: ✅ SOLIDWORKS CAD, AutoCAD Básico

Buscar: "basico" (sin acento)
Resultado: ✅ AutoCAD Básico
```

---

## Casos de Uso Comunes

### Caso 1: Crear Registro Nuevo

1. Abre tu Google Sheet
2. Agrega una nueva fila al final
3. Llena todos los datos
4. Los cambios se ven inmediatamente en la aplicación

---

### Caso 2: Actualizar Registro Existente

1. En la aplicación, busca el registro
2. Si necesitas cambiar algo, edita directamente en Google Sheet
3. Recarga la aplicación o espera a que se actualice

---

### Caso 3: Cargar Lote de Datos

1. Prepara un Excel con todos los registros
2. Usa el botón **"Cargar"** en la aplicación
3. El Excel se sincroniza con Google Sheet

---

### Caso 4: Cambiar a Otro Google Sheet

1. Ve a `backend/.env`
2. Actualiza `EXCEL_SOURCE_URL` con el ID del nuevo Sheet
3. Reinicia el backend
4. Recarga la aplicación

---

## Notas Importantes

### ⚠️ Importante

- ✅ Los datos siempre se guardan en Google Sheets
- ✅ El backend solo es un intermediario
- ❌ El backend no tiene base de datos propia (sin almacenamiento persistente)
- ✅ Los cambios en Google Sheet se reflejan en la app en pocos segundos
- ⚠️ No compartas la URL de Google Apps Script públicamente (es como una contraseña)

---

## Ejemplos de Archivos

### Archivo Excel Válido (Mínimo)

```
Columna A (ID) | Columna B (Start time) | Columna C (Completion time) | Columna D (Email) | Columna E (Name) | Columna F (Last modified time)
1              | 2026-06-17 10:00:00   | 2026-06-17 10:15:00        | user@example.com | Juan Pérez      | 2026-06-17 10:15:00
2              | 2026-06-17 11:00:00   | 2026-06-17 11:15:00        | user2@example.com| María López     | 2026-06-17 11:15:00
```

---

### Archivo Excel Completo (Con formulario)

Ver la estructura completa en la sección "Estructura Completa (Ejemplo Real)" arriba.

---

## Troubleshooting de Datos

| Problema | Causa | Solución |
|----------|-------|----------|
| No veo datos en la app | Google Sheet vacío | Agrega datos a Google Sheet |
| Los datos no se actualizan | Cache del navegador | Presiona Ctrl+F5 para forzar recarga |
| No puedo cargar Excel | Columnas diferentes | Verifica nombres y orden exacto |
| Datos duplicados | Carguaste dos veces | Edita Google Sheet y elimina duplicados |
| Faltan columnas en la tabla | Sheet incompleto | Agrega todas las columnas del header |

---

**Versión:** 3.0.0  
**Última actualización:** 2026-06-17
