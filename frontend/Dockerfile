# Etapa 1: build con imagen oficial de Bun (más pequeña y rápida que node + npm install -g bun)
FROM oven/bun:1-slim AS build-stage

WORKDIR /app

# Copiar package.json primero para aprovechar caché de layers
COPY ./frontend/package.json /app/package.json
RUN bun install

# Copiar el resto del frontend y construir
COPY ./frontend /app/
RUN bun run build

# Etapa 2: imagen de producción con nginx Alpine (mucho más pequeña que nginx:1)
FROM nginx:1.27-alpine

COPY --from=build-stage /app/dist/frontend/browser/ /usr/share/nginx/html
COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf
