# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Compilar la aplicación
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Instalar servidor HTTP simple para servir la aplicación
RUN npm install -g serve

# Copiar archivos compilados desde builder
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 4200

# Comando para ejecutar la aplicación
CMD ["serve", "-s", "dist/gestion-eventos-app", "-l", "4200"]
