# 🚀 Guía de Instalación - Gestión de Eventos

Esta guía te ayudará a configurar y ejecutar la aplicación en tu computadora.

## 📋 Verificación Previa

Antes de empezar, verifica que tu sistema cumpla con los requisitos.

### En Windows:

1. Abre **PowerShell** o **CMD**
2. Ejecuta los siguientes comandos para verificar las versiones instaladas:

```powershell
node --version
npm --version
```

Deberías ver algo como:
- `v18.0.0` o superior (Node.js)
- `9.0.0` o superior (npm)

Si no aparecen estas versiones o dice "comando no encontrado", necesitas instalar Node.js.

## 📥 Paso 1: Instalar Node.js y npm

Si no tienes Node.js instalado:

1. Ve a [https://nodejs.org/](https://nodejs.org/)
2. Descarga la versión **LTS (Long Term Support)**
3. Ejecuta el instalador y sigue los pasos
4. Cuando llegues a la opción "Tools for Native Modules", déjalo sin marcar
5. Completa la instalación
6. **Reinicia tu computadora** (importante)

## 🔧 Paso 2: Descargar el Repositorio

### Opción A: Si tienes Git instalado

Abre PowerShell en la carpeta donde deseas guardar el proyecto y ejecuta:

```powershell
git clone <URL_DEL_REPOSITORIO>
cd inscripciones_eventos
```

### Opción B: Descargar como ZIP

1. Ve al repositorio en GitHub
2. Haz clic en **Code** → **Download ZIP**
3. Extrae el ZIP en la carpeta donde deseas trabajar
4. Abre PowerShell en esa carpeta

## 📦 Paso 3: Instalar Dependencias

Este es el paso más importante. Angular y todas sus dependencias se descargarán automáticamente.

1. Abre **PowerShell** o **CMD**
2. Navega a la carpeta del proyecto (usa `cd` para cambiar de carpeta)
3. Ejecuta:

```powershell
npm install
```

Este proceso puede tardar entre 3-10 minutos la primera vez. Verás mucho texto en la pantalla, esto es normal. Espera hasta que termine.

**¿Qué está pasando?**
- npm está descargando Angular y sus dependencias desde internet
- Está guardándolas en una carpeta `node_modules` en tu proyecto

## 🎮 Paso 4: Ejecutar la Aplicación

Una vez completada la instalación:

```powershell
npm start
```

Esto hará lo siguiente:
- Angular compilará el código
- Se abrirá automáticamente tu navegador
- Verás la aplicación en `http://localhost:4200/`

Si el navegador no se abre automáticamente, abre manualmente:
- Chrome, Firefox o Edge
- Ve a: `http://localhost:4200/`

## ✅ ¡Listo!

Si ves la página con el botón "Descargar Información" y la tabla vacía, ¡significa que todo está funcionando correctamente!

## 🔄 Comandos Útiles

Mientras tienes la aplicación ejecutándose, puedes:

- **Detener la aplicación**: Presiona `Ctrl + C` en PowerShell
- **Ver cambios en vivo**: Si editas un archivo, la página se actualizará automáticamente
- **Volver a ejecutar**: Ejecuta `npm start` de nuevo

## 🛠️ Otros Comandos Disponibles

```powershell
# Compilar para producción
npm run build

# Ejecutar pruebas unitarias
npm test

# Ver la versión de Angular CLI
npm run ng -- version
```

## ❌ Problemas Comunes

### Error: "npm: command not found"
- Node.js no está instalado correctamente
- Instala desde [https://nodejs.org/](https://nodejs.org/)
- Reinicia tu computadora después de instalar

### Error: "Cannot find module"
- Las dependencias no están instaladas
- Ejecuta: `npm install`

### El navegador no se abre automáticamente
- Abre manualmente: `http://localhost:4200/`

### Puerto 4200 en uso
- Otro programa está usando el puerto
- Cierra otras aplicaciones Angular o ejecuta: `ng serve --port 4201`

### Error de permisos en Windows
- Intenta ejecutar PowerShell como administrador
- Click derecho en PowerShell → "Ejecutar como administrador"

## 📞 Soporte

Si tienes problemas que no aparecen aquí:
1. Copia el mensaje de error completo
2. Abre una issue en el repositorio
3. Proporciona:
   - Tu sistema operativo
   - Versión de Node.js (ejecuta `node --version`)
   - Versión de npm (ejecuta `npm --version`)
   - El mensaje de error completo

## 📚 Recursos Útiles

- [Documentación de Angular](https://angular.io/docs)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

**¡Disfruta desarrollando! 🎉**
