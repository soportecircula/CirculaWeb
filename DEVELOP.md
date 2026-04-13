# Guía de Desarrollo — CirculaWeb

Instrucciones completas para levantar el ambiente local, generar el cliente HTTP, trabajar con los assets de Velzon y usar los scripts del proyecto.

---

## Índice

1. [Requisitos previos](#1-requisitos-previos)
2. [Levantar el ambiente local](#2-levantar-el-ambiente-local)
3. [Variables de entorno](#3-variables-de-entorno)
4. [Servicios y puertos locales](#4-servicios-y-puertos-locales)
5. [Generación del cliente HTTP](#5-generación-del-cliente-http)
6. [Scripts del proyecto](#6-scripts-del-proyecto)
7. [Desarrollo frontend sin Docker](#7-desarrollo-frontend-sin-docker)
8. [Desarrollo backend sin Docker](#8-desarrollo-backend-sin-docker)
9. [Migraciones de base de datos](#9-migraciones-de-base-de-datos)
10. [Assets Velzon y template de referencia](#10-assets-velzon-y-template-de-referencia)
11. [Flujo completo de una nueva feature](#11-flujo-completo-de-una-nueva-feature)
12. [Problemas comunes](#12-problemas-comunes)

---

Nota: los folders **velzon/** y **template/** son de solo lectura, y son de referencia para el desarrollo no se deben modificar.

## 1. Requisitos previos

| Herramienta | Versión mínima | Instalación |
|---|---|---|
| Docker Desktop | 4.x | https://www.docker.com/products/docker-desktop |
| UV (Python) | 0.6+ | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| Bun (Node) | 1.x | `curl -fsSL https://bun.sh/install \| bash` |
| Git | 2.x | https://git-scm.com |

---

## 2. Levantar el ambiente local

### Primera vez

```bash
# 1. Clonar y entrar al proyecto
git clone git@github.com:soportecircula/CirculaWeb.git CirculaWeb
cd CirculaWeb

# 2. Crear archivo de entorno
cp .env.example .env
# Editar .env con tus valores (al menos FIRST_SUPERUSER y contraseñas)

# 3. Generar uv.lock (necesario para el build Docker del backend)
uv sync

# 4. Instalar dependencias del frontend
cd frontend && bun install && cd ..

# 5. Construir imágenes Docker
docker compose build

# 6. Levantar stack completo
docker compose up -d

# 7. Esperar a que el backend esté sano (~30 seg) y generar cliente HTTP
bash scripts/generate-client.sh
```

> **Nota:** Los pasos 3–7 solo se necesitan la primera vez o cuando cambia el schema de la API.

### Días siguientes (stack ya inicializado)

```bash
docker compose up -d
```

### Ver logs en vivo

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f        # todos los servicios
```

### Detener el stack

```bash
docker compose down           # mantiene volúmenes (datos intactos)
docker compose down -v        # destruye volúmenes (reset total de datos)
```

---

## 3. Variables de entorno

El archivo `.env` en la raíz controla toda la configuración. Nunca commitear `.env` — está en `.gitignore`.

### Referencia completa

```env
# ── Docker ──────────────────────────────────────────────────
DOCKER_IMAGE_BACKEND=circula-backend   # Nombre de imagen backend
DOCKER_IMAGE_FRONTEND=circula-frontend # Nombre de imagen frontend
TAG=latest                              # Tag de las imágenes
STACK_NAME=circula                      # Prefijo de red/stack Docker
DOMAIN=localhost                        # Dominio (localhost en dev)

# ── PostgreSQL ───────────────────────────────────────────────
POSTGRES_SERVER=db                      # Hostname dentro de Docker
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<tu-password>         # CAMBIAR
POSTGRES_DB=app

# ── Backend ──────────────────────────────────────────────────
PROJECT_NAME=circula
SECRET_KEY=<mínimo-32-chars>            # CAMBIAR — usar: openssl rand -hex 32
FIRST_SUPERUSER=admin@example.com       # Email del superadmin inicial
FIRST_SUPERUSER_PASSWORD=<password>     # CAMBIAR

# ── URLs y CORS ──────────────────────────────────────────────
FRONTEND_HOST=http://localhost:4200
ENVIRONMENT=local                       # local | staging | production
BACKEND_CORS_ORIGINS=http://localhost:4200,http://localhost:80

# ── SMTP (dev: mailcatcher, ver puerto 1080) ─────────────────
SMTP_HOST=mailcatcher
SMTP_PORT=1025
SMTP_TLS=false
SMTP_USER=
SMTP_PASSWORD=
EMAILS_FROM_EMAIL=noreply@example.com

# ── MinIO (almacenamiento S3-compatible) ─────────────────────
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=<tu-password>       # CAMBIAR
MINIO_BUCKET=circula
MINIO_ENDPOINT=http://minio:9000        # URL interna Docker
MINIO_PUBLIC_URL=http://localhost:9100  # URL accesible desde host
STORAGE_BACKEND=minio

# ── Redis ────────────────────────────────────────────────────
# REDIS_PASSWORD se configura en compose.yml como variable inline
# Si quieres personalizarla, agregar aquí:
# REDIS_PASSWORD=<tu-password>

# ── Opcional ─────────────────────────────────────────────────
SENTRY_DSN=                             # DSN de Sentry para errores en prod
```

### Generar SECRET_KEY segura

```bash
openssl rand -hex 32
```

### Si cambias POSTGRES_PASSWORD y ya tienes un volumen

```bash
docker compose down -v   # borra volúmenes, incluyendo datos de la DB
docker compose up -d     # reinicia desde cero
```

---

## 4. Servicios y puertos locales

| Servicio | URL local | Descripción |
|---|---|---|
| **Frontend** | http://localhost:4200 | App Angular (Nginx en Docker) |
| **Backend API** | http://localhost:8000 | FastAPI |
| **Swagger UI** | http://localhost:8000/docs | Documentación interactiva de la API |
| **ReDoc** | http://localhost:8000/redoc | Documentación alternativa de la API |
| **Traefik dashboard** | http://localhost:8090 | Panel de rutas del proxy |
| **Adminer (DB)** | http://localhost:8080 | GUI para PostgreSQL |
| **MinIO Console** | http://localhost:9001 | Panel de administración de MinIO |
| **MinIO S3 API** | http://localhost:9100 | Endpoint S3 compatible |
| **Mailcatcher** | http://localhost:1080 | Captura de emails enviados en dev |
| **PostgreSQL** | localhost:5433 | Puerto local (5432 es el default, mapeado a 5433) |
| **Redis** | localhost:6380 | Solo accesible desde localhost |

### Credenciales de Adminer (GUI de DB)

- **Sistema**: PostgreSQL
- **Servidor**: `db`
- **Usuario**: valor de `POSTGRES_USER`
- **Contraseña**: valor de `POSTGRES_PASSWORD`
- **Base de datos**: valor de `POSTGRES_DB`

---

## 5. Generación del cliente HTTP

El frontend **no puede compilar** sin el cliente generado. El cliente se genera automáticamente desde el OpenAPI del backend.

### Cuándo regenerar

- Al agregar, modificar o eliminar un endpoint en el backend
- Al cambiar un schema Pydantic que se expone en la API
- Al configurar el proyecto por primera vez

### Pasos

```bash
# El backend debe estar corriendo en localhost:8000
bash scripts/generate-client.sh
```

Este script hace internamente:

1. **Exporta el OpenAPI** del backend a `frontend/swagger.json`
2. **Ejecuta ng-openapi** para generar `frontend/src/client/` (servicios, modelos, providers)
3. **Corrige el barrel** `models.ts` si falta algún export

### ¿Qué genera?

```
frontend/src/client/
├── models/          # Interfaces TypeScript (una por schema Pydantic)
├── services/        # Angular services con métodos tipados por endpoint
│   ├── login.service.ts
│   ├── users.service.ts
│   └── utils.service.ts
├── models.ts        # Barrel de exports de modelos
├── services.ts      # Barrel de exports de servicios
└── providers.ts     # provideDefaultClient() para app.config.ts
```

> **Regla:** Nunca editar manualmente `frontend/src/client/`. Los cambios se pierden al regenerar.

### Configuración del generador

Archivo: `frontend/openapi.config.ts`

```typescript
export default {
  input: './swagger.json',        // spec descargada del backend
  output: './src/client',         // destino de los archivos generados
  options: {
    dateType: 'string',           // fechas como string (no Date)
    enumStyle: 'enum',            // genera enums TypeScript nativos
  },
} as GeneratorConfig;
```

---

## 6. Scripts del proyecto

### `scripts/generate-client.sh`

Genera el cliente Angular desde el OpenAPI del backend.

```bash
bash scripts/generate-client.sh
```

**Requiere:** backend corriendo en `localhost:8000` y `bun` + `uv` instalados.

---

### `scripts/fix-client-models-barrel.sh`

Corrige el barrel `frontend/src/client/models.ts` asegurando que todos los modelos estén exportados. Se ejecuta automáticamente al final de `generate-client.sh`.

```bash
bash scripts/fix-client-models-barrel.sh
```

Útil si el build falla con `Cannot find module '...client/models'` después de agregar un schema nuevo.

---

### `scripts/init-db.sh`

Script de inicialización de PostgreSQL (ejecutado por Docker al crear el contenedor de DB por primera vez). Verifica que la base de datos esté disponible.

```bash
# No se ejecuta manualmente — es para uso interno de Docker
```

---

### `frontend/scripts/sync-version.js`

Sincroniza la versión de `package.json` al archivo `frontend/src/app/core/version.ts`. Se ejecuta automáticamente como `prebuild` antes de `ng build`.

```bash
# Se ejecuta solo al hacer: bun run build
node frontend/scripts/sync-version.js
```

---

### `backend/scripts/prestart.sh`

Script que corre dentro del contenedor `prestart` de Docker:

1. Espera a que PostgreSQL esté disponible (`backend_pre_start.py`)
2. Aplica migraciones Alembic (`alembic upgrade head`)
3. Crea datos iniciales (`initial_data.py` — superusuario si no existe)

```bash
# No se ejecuta manualmente — es para uso interno de Docker
# Para correr migraciones manualmente desde el host:
cd backend && POSTGRES_SERVER=localhost POSTGRES_PORT=5433 uv run alembic upgrade head
```

---

## 7. Desarrollo frontend sin Docker

Para desarrollo activo del frontend con hot-reload:

```bash
# El backend debe estar corriendo (con Docker)
cd frontend
bun run start      # levanta ng serve en http://localhost:4200
```

El proxy está configurado en `proxy.conf.json` para redirigir `/api` → `http://localhost:8000`.

### Scripts disponibles en `frontend/`

```bash
bun run start               # ng serve con proxy
bun run build               # build de producción (incluye sync-version)
bun run generate:client     # solo regenera el cliente (sin descargar swagger)
bun run lint                # ng lint
bun run test                # ng test
bun run format              # prettier en src/**/*.{ts,html,scss}
```

---

## 8. Desarrollo backend sin Docker

Para correr el backend localmente (requiere PostgreSQL y Redis accesibles):

```bash
# Con Docker corriendo solo la infraestructura
docker compose up -d db redis minio

# Correr el backend en modo desarrollo con hot-reload
cd backend
POSTGRES_SERVER=localhost POSTGRES_PORT=5433 \
REDIS_HOST=localhost REDIS_PORT=6380 \
MINIO_ENDPOINT=http://localhost:9100 \
uv run fastapi run --reload app/main.py
```

La API quedará disponible en `http://localhost:8000`.

### Agregar una dependencia Python

```bash
cd backend
uv add <paquete>          # agrega y actualiza uv.lock automáticamente
```

---

## 9. Migraciones de base de datos

### Generar una nueva migración

```bash
# Con la DB corriendo (Docker o local)
cd backend
POSTGRES_SERVER=localhost POSTGRES_PORT=5433 \
uv run alembic revision --autogenerate -m "descripcion_del_cambio"
```

El archivo se crea en `backend/app/alembic/versions/`.

### Aplicar migraciones

```bash
# Desde el host (con DB en Docker)
cd backend
POSTGRES_SERVER=localhost POSTGRES_PORT=5433 \
uv run alembic upgrade head

# O reiniciando el stack (el contenedor prestart aplica migraciones automáticamente)
docker compose up -d
```

### Ver estado de migraciones

```bash
cd backend
POSTGRES_SERVER=localhost POSTGRES_PORT=5433 \
uv run alembic current

# Ver historial
uv run alembic history
```

### Revertir última migración

```bash
cd backend
POSTGRES_SERVER=localhost POSTGRES_PORT=5433 \
uv run alembic downgrade -1
```

---

## 10. Assets Velzon y template de referencia

El proyecto tiene dos fuentes de referencia de UI que **no se modifican directamente** — se copian de forma incremental hacia `frontend/src/`:

### `/velzon/` — Template Velzon para Angular

Ubicación: `./velzon/` (en la raíz del proyecto CirculaWeb)

Es la referencia principal para la UI. Contiene:

```
velzon/
├── src/
│   ├── app/
│   │   └── layouts/          # Layouts: vertical, horizontal, two-column
│   │       ├── vertical/     # Layout vertical (el que usamos)
│   │       ├── topbar/       # Header con logo, búsqueda, notificaciones
│   │       ├── sidebar/      # Sidebar con menú colapsable
│   │       ├── footer/       # Footer
│   │       └── rightsidebar/ # Panel de configuración de tema
│   └── assets/
│       ├── scss/             # SCSS del tema (variables, componentes, páginas)
│       └── images/           # Logos, avatares, fondos
```

**Regla de uso:**
1. Identificar el componente o estilo que necesitas en `velzon/`
2. Copiar/adaptar hacia `frontend/src/`
3. Adaptar a Angular 21 standalone (quitar `standalone: false`, agregar `imports: [...]`)
4. Nunca editar `velzon/` directamente

**Ejemplo — agregar un nuevo componente de Velzon:**

```bash
# Ver cómo está implementado en velzon
cat velzon/src/app/layouts/rightsidebar/rightsidebar.component.html

# Copiar y adaptar a frontend/src/app/layouts/rightsidebar/
```

### `/template/` — Template full-stack de referencia

Ubicación: `./template/` (en la raíz del proyecto CirculaWeb)

Es el template upstream `full-stack-fastapi-template` de Tiangolo. Útil como referencia para:
- Patrones de backend FastAPI (deps, CRUD, schemas)
- Configuración de Docker Compose
- Scripts de CI/CD

**Regla:** No copiar código del template directamente sin revisión — algunas partes usan SQLModel (nosotros usamos SQLAlchemy 2.x puro).

### SCSS del tema

Los archivos SCSS del tema Velzon están en `frontend/src/assets/scss/`. Estructura:

```
frontend/src/assets/scss/
├── bootstrap.scss          # Importa Bootstrap + variables Velzon
├── icons.scss              # Iconos: MDI, Boxicons, Remix Icons
├── app.scss                # Estilos principales del tema
├── angular-custom.scss     # Overrides específicos para Angular
├── _variables.scss         # Variables de color y tipografía del tema
├── _variables-custom.scss  # Overrides de variables (EDITAR AQUÍ para customizar)
├── _variables-dark.scss    # Variables en modo oscuro
├── components/             # Estilos de componentes Bootstrap extendidos
├── structure/              # Layout: sidebar, topbar, footer, page-content
├── pages/                  # Estilos por página (auth, dashboard, etc.)
└── plugins/                # Estilos de plugins de terceros
```

**Para personalizar colores:** editar `_variables-custom.scss`.

### Iconos disponibles

El tema incluye tres librerías de iconos:

| Librería | Prefijo | Ejemplo |
|---|---|---|
| **Material Design Icons (MDI)** | `mdi mdi-*` | `mdi mdi-account-circle` |
| **Boxicons** | `bx bx-*` / `bx bxs-*` | `bx bx-home`, `bx bxs-dashboard` |
| **Remix Icons** | `ri-*` | `ri-user-line`, `ri-settings-3-line` |

Búsqueda de iconos:
- MDI: https://pictogrammers.com/library/mdi/
- Boxicons: https://boxicons.com/
- Remix Icons: https://remixicon.com/

### Logo

El logo de la aplicación está en `frontend/src/assets/images/`:

| Archivo | Uso |
|---|---|
| `logo.jpg` | Logo grande (sidebar y topbar expandidos) |
| `logo-sm.png` | Logo pequeño (sidebar colapsado) |

Para reemplazar el logo: sustituir estos archivos manteniendo los mismos nombres.

---

## 11. Flujo completo de una nueva feature

Ejemplo: agregar el módulo "Productores REP".

### Paso 1 — Modelo en backend

```bash
# Crear el modelo SQLAlchemy en backend/app/models/producer.py
# Agregar a backend/app/models/__init__.py
```

### Paso 2 — Schema Pydantic

```bash
# Crear schemas en backend/app/schemas/producer.py
```

### Paso 3 — CRUD

```bash
# Crear backend/app/crud/producer.py
```

### Paso 4 — Endpoints FastAPI

```bash
# Crear backend/app/api/routes/producers.py
# Registrar en backend/app/api/main.py
```

### Paso 5 — Migración

```bash
cd backend
POSTGRES_SERVER=localhost POSTGRES_PORT=5433 \
uv run alembic revision --autogenerate -m "add_producers_table"
# Revisar el archivo generado antes de aplicar
POSTGRES_SERVER=localhost POSTGRES_PORT=5433 \
uv run alembic upgrade head
```

### Paso 6 — Regenerar cliente

```bash
# Con el backend corriendo
bash scripts/generate-client.sh
```

### Paso 7 — Componente Angular

```bash
# Crear frontend/src/app/features/producers/producer-list.component.ts
# Agregar ruta en frontend/src/app/app.routes.ts
# Agregar ítem de menú en frontend/src/app/layouts/sidebar/sidebar.component.ts
```

### Paso 8 — Verificar

```bash
cd frontend && bun run build    # debe compilar sin errores
docker compose build frontend   # imagen Docker OK
docker compose up -d            # stack completo
```

---

## 12. Problemas comunes

### El frontend no compila: "Cannot find module '../client/providers'"

El cliente HTTP no ha sido generado. Solución:

```bash
# Backend debe estar corriendo
bash scripts/generate-client.sh
```

### Error de migración: "uv.lock not found" al hacer docker compose build

El `uv.lock` no existe. Generarlo:

```bash
uv sync    # genera uv.lock en la raíz
```

### Error de prestart: "relation 'users' does not exist"

No hay migraciones generadas. Solución:

```bash
cd backend
POSTGRES_SERVER=localhost POSTGRES_PORT=5433 \
uv run alembic revision --autogenerate -m "initial"
docker compose build backend
docker compose up -d
```

### POSTGRES_PASSWORD cambió pero el volumen tiene la contraseña anterior

```bash
docker compose down -v    # ⚠️ borra todos los datos
docker compose up -d
```

### El cliente se generó pero el build falla por modelos faltantes en barrel

```bash
bash scripts/fix-client-models-barrel.sh
```

### El backend falla con "could not connect to Redis"

Verificar que `REDIS_PASSWORD` en `compose.yml` coincide con la configuración de Redis. En dev, el valor por defecto es `changeme`.

### Cambios en `frontend/src/` no se reflejan en la imagen Docker

El Docker usa una build estática. Reconstruir:

```bash
docker compose build frontend
docker compose up -d frontend
```

Para desarrollo activo con hot-reload, usar `bun run start` directamente (ver sección 7).
