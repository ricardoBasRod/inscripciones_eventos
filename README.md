# Gestión de Eventos - Inscripciones

Aplicación Angular para visualizar y gestionar inscripciones de eventos desde un archivo Excel en OneDrive.

## Características

- ✨ Interfaz moderna y responsiva
- 📥 Botón para descargar datos desde OneDrive
- 📊 Tabla dinámica para visualizar datos
- 🎨 Diseño limpio y profesional
- 📱 Compatible con dispositivos móviles

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) - [Descargar](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **Angular CLI** (se instalará automáticamente con npm install)

## Instalación y Ejecución

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd inscripciones_eventos
```

### 2. Instalar Dependencias

```bash
npm install
```

Este comando descargará e instalará todas las dependencias necesarias incluyendo Angular, TypeScript y otras librerías requeridas.

### 3. Ejecutar la Aplicación

```bash
npm start
```

La aplicación se abrirá automáticamente en tu navegador en `http://localhost:4200/`.

## Desarrollo

### Servir la aplicación en desarrollo

```bash
ng serve
```

Accede a `http://localhost:4200/` en tu navegador. La aplicación se recargará automáticamente si cambias alguno de los archivos del código.

### Generar una compilación para producción

```bash
ng build
```

Los archivos compilados se guardarán en el directorio `dist/`.

### Ejecutar pruebas unitarias

```bash
ng test
```

Se abrirá Karma y ejecutará los tests.

## Estructura del Proyecto

```
inscripciones_eventos/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   └── data.service.ts       # Servicio para manejar datos
│   │   ├── app.component.ts          # Componente principal
│   │   ├── app.component.html        # Template del componente
│   │   ├── app.component.css         # Estilos del componente
│   │   └── app.routes.ts             # Rutas de la aplicación
│   ├── assets/                       # Archivos estáticos
│   ├── main.ts                       # Archivo de entrada
│   ├── index.html                    # HTML principal
│   └── styles.css                    # Estilos globales
├── angular.json                      # Configuración de Angular CLI
├── tsconfig.json                     # Configuración de TypeScript
├── karma.conf.js                     # Configuración de pruebas
├── package.json                      # Dependencias del proyecto
└── README.md                         # Este archivo
```

## Próximas Mejoras

- [ ] Integración con OneDrive API
- [ ] Implementar lectura de archivos Excel
- [ ] Agregar filtros y búsqueda en la tabla
- [ ] Exportar datos a diferentes formatos
- [ ] Autenticación con Microsoft 365
- [ ] Paginación de datos

## Tecnologías Utilizadas

- **Angular 18** - Framework frontend
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **Bootstrap & CSS** - Estilos

## Solución de Problemas

### Error: "npm: command not found"
Asegúrate de tener Node.js instalado correctamente. Descárgalo desde [nodejs.org](https://nodejs.org/)

### Error: "ng: command not found"
Ejecuta `npm install -g @angular/cli` para instalar Angular CLI globalmente.

### Error de permisos
En Mac/Linux, puede que necesites ejecutar `sudo npm install` dependiendo de tu configuración.

## Contribuir

Si encuentras algún problema o tienes sugerencias, por favor abre un issue o pull request.

## Licencia

Este proyecto está bajo la licencia MIT.

## Contacto

Para más información o preguntas, contacta al equipo de desarrollo.
