# 👨‍💻 Guía de Desarrollo

Esta guía es para desarrolladores que deseen trabajar en el proyecto.

## 🏗️ Estructura del Proyecto

```
src/
├── app/                          # Componentes de la aplicación
│   ├── services/
│   │   ├── data.service.ts       # Servicio para obtener datos
│   │   └── data.service.spec.ts  # Tests del servicio
│   ├── app.component.ts          # Componente raíz
│   ├── app.component.html        # Template HTML del componente
│   ├── app.component.css         # Estilos del componente
│   ├── app.component.spec.ts     # Tests del componente
│   └── app.routes.ts             # Configuración de rutas
├── environments/                 # Configuraciones por ambiente
│   ├── environment.ts            # Ambiente de desarrollo
│   └── environment.prod.ts       # Ambiente de producción
├── assets/                       # Recursos estáticos
├── styles.css                    # Estilos globales
├── main.ts                       # Punto de entrada de la aplicación
├── index.html                    # HTML principal
└── polyfills.ts                  # Polyfills necesarios
```

## 📚 Stack Tecnológico

- **Angular 18** - Framework frontend progresivo
- **TypeScript** - Lenguaje tipado de JavaScript
- **RxJS** - Programación reactiva con Observables
- **CSS 3** - Estilos responsive

## 🚀 Desarrollo Local

### Iniciar el servidor de desarrollo

```bash
npm start
# o
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`

### Compilación para producción

```bash
npm run build
# o
ng build --configuration production
```

Los archivos compilados estarán en `dist/gestion-eventos-app/`

## 🧪 Testing

### Ejecutar todos los tests

```bash
npm test
```

### Ejecutar tests con cobertura

```bash
ng test --code-coverage
```

### Ejecutar tests una sola vez (útil en CI/CD)

```bash
ng test --watch=false
```

## 🔧 Desarrollo de Características

### Crear un nuevo componente

```bash
ng generate component components/nombre-componente
```

### Crear un nuevo servicio

```bash
ng generate service services/nombre-servicio
```

### Crear una nueva directiva

```bash
ng generate directive nombre-directiva
```

### Crear un nuevo pipe

```bash
ng generate pipe pipes/nombre-pipe
```

## 📝 Convenciones de Código

### Nombrado de archivos

- Componentes: `nombre.component.ts`
- Servicios: `nombre.service.ts`
- Tests: `nombre.spec.ts`
- Módulos: `nombre.module.ts`
- Rutas: `nombre.routes.ts`

### Estructura de componentes

```typescript
import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-nombre",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./nombre.component.html",
  styleUrl: "./nombre.component.css",
})
export class NombreComponent {
  @Input() prop: string = "";
  @Output() evento = new EventEmitter<string>();

  constructor() {}

  metodo(): void {
    // implementación
  }
}
```

## 🔌 Integración con OneDrive (Próxima Fase)

Para integrar OneDrive, se necesitará:

1. **Registrar la aplicación en Azure**
   - Ir a [Azure Portal](https://portal.azure.com)
   - Crear un nuevo app registration
   - Obtener el Client ID

2. **Instalar librerías necesarias**

   ```bash
   npm install @azure/msal-browser @azure/msal-angular
   npm install xlsx
   ```

3. **Crear servicio de autenticación**

   ```bash
   ng generate service services/auth.service
   ```

4. **Actualizar data.service.ts**
   - Implementar método para descargar Excel desde OneDrive
   - Parsear el archivo Excel

## 🎨 Guía de Estilos

### Variables CSS (si se utiliza)

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --border-radius: 5px;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### Responsive Design

- Mobile First approach
- Breakpoints:
  - sm: 576px
  - md: 768px
  - lg: 992px
  - xl: 1200px

## 📊 Performance

### Optimizaciones realizadas

- ✅ Standalone components (sin módulos)
- ✅ Lazy loading de rutas (cuando sea necesario)
- ✅ OnPush change detection (cuando sea aplicable)
- ✅ Code splitting automático

### Recomendaciones adicionales

- Usar `trackBy` en \*ngFor para listas grandes
- Implementar Virtual Scroll para listas muy grandes
- Optimizar imágenes con WebP
- Usar lazy loading en componentes pesados

## 🐛 Debugging

### Console Logs

```typescript
console.log("Mensaje de debug", objeto);
console.warn("Advertencia");
console.error("Error");
```

### DevTools de Angular

En el navegador, instala:

- [Angular DevTools](https://angular.io/guide/devtools)

### Visual Studio Code Debugger

Archivo `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ng serve",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}",
      "sourceMap": true
    }
  ]
}
```

## 📦 Versionado Semántico

El proyecto sigue [Semantic Versioning](https://semver.org/):

- MAJOR.MINOR.PATCH
- Ej: 1.0.0

## 🔄 Git Workflow

### Ramas

- `main` - Rama de producción
- `develop` - Rama de desarrollo
- `feature/*` - Nuevas características
- `bugfix/*` - Corrección de bugs

### Commit Message

```
[tipo]: descripción breve

Descripción detallada si es necesaria

Fixes #123
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 📚 Recursos Útiles

- [Angular Documentation](https://angular.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
- [Material Design](https://material.io/design)

## 🆘 Problemas Comunes

### "Cannot find module"

```bash
# Limpiar cache
rm -rf node_modules package-lock.json
npm install
```

### Estilos no se aplican

- Verificar que el archivo CSS esté importado en el componente
- Limpiar el cache del navegador (Ctrl+F5)

### Tests fallando

```bash
# Actualizar karma
npm test -- --watch=false --browsers=ChromeHeadless
```

---

¡Happy Coding! 🎉
