# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

**Propósito**: Plataforma REP (Responsabilidad Extendida del Productor) para Circula Colombia S.A.S.
- **Frontend**: Angular 21 standalone + Signals + NgRx (dashboard + landing pública), servido por Nginx.
- **Backend**: FastAPI + SQLAlchemy 2.x + Alembic + PostgreSQL (single-tenant).
- **Deploy**: Docker Compose en raíz (`compose.yml`, `compose.override.yml`, `compose.traefik.yml`). Sin carpeta `infra/`.

---

## Reglas hard (NO negociables)

1. Branch principal: `main`.
2. **NO `infra/`**: archivos Compose siempre en raíz.
3. **NO SQLModel**: usar SQLAlchemy 2.x puro (`Mapped`, `mapped_column`).
4. **NO editar** `frontend/src/client/` (generado por ng-openapi) ni `velzon/` (vendor).
5. **Contract-first**: OpenAPI manda → ng-openapi → frontend.
6. **Sin multi-business**: no `business_id`, no memberships, no tenant.
7. **NgRx clásico** para auth + layout. Sin SignalStore.
8. Componentes Angular siempre **standalone** + **OnPush**.

---

## Fuentes de verdad (leer antes de cambiar código)

| Doc | Contenido |
|---|---|
| `docs/ARCHITECTURE.md` | Stack, rutas API, flujos de auth |
| `docs/DECISIONS.md` | Decisiones técnicas con fecha |
| `docs/MILESTONES.md` | Estado de avance por milestone |
| `docs/BACKEND_GUIDE.md` | Patrones FastAPI + SQLAlchemy + Alembic |
| `docs/FRONTEND_GUIDE.md` | Patrones Angular + Velzon + ng-openapi |
| `docs/SECURITY.md` | Seguridad, tokens, rate limiting |

---

## Comandos de desarrollo

### Backend (Python, gestionado con UV)

```bash
cd backend

# Instalar dependencias
uv sync

# Arrancar servidor de desarrollo
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Lint + type check
uv run ruff check .
uv run ruff format .
uv run mypy app

# Tests
uv run pytest
uv run pytest tests/path/to/test_file.py::test_name  # test individual

# Migraciones Alembic
uv run alembic revision --autogenerate -m "descripcion"
uv run alembic upgrade head
uv run alembic current
uv run alembic downgrade -1

# Crear superuser inicial
uv run python app/initial_data.py
```

### Frontend (Angular, gestionado con Bun)

```bash
cd frontend

# Instalar dependencias
bun install

# Servidor de desarrollo (http://localhost:4200, proxy /api → :8000)
bun run start

# Build de producción (incluye prebuild sync-version)
bun run build

# Lint (Angular ESLint)
bun run lint

# Formato (Prettier)
bun run format

# Tests
bun run test

# Solo regenerar el cliente (sin descargar swagger)
bun run generate:client
```

### Generación del cliente HTTP (requiere backend corriendo en :8000)

```bash
bash scripts/generate-client.sh
```

Esto descarga el `swagger.json` del backend, ejecuta ng-openapi y genera `frontend/src/client/`. Hacer esto después de cualquier cambio a endpoints o schemas. Si el build falla por modelos faltantes en el barrel: `bash scripts/fix-client-models-barrel.sh`.

### Docker Compose

```bash
# Desarrollo (levanta backend, frontend, postgres, redis, minio)
docker compose -f compose.yml -f compose.override.yml up

# Producción con Traefik
docker compose -f compose.yml -f compose.traefik.yml up -d
```

---

### Backend fuera de Docker (infraestructura en Docker, backend en host)

```bash
# Levantar solo infraestructura
docker compose up -d db redis minio

# Correr backend con hot-reload (DB en puerto 5433, Redis en 6380)
cd backend
POSTGRES_SERVER=localhost POSTGRES_PORT=5433 \
REDIS_HOST=localhost REDIS_PORT=6380 \
MINIO_ENDPOINT=http://localhost:9100 \
uv run fastapi run --reload app/main.py

# Migraciones contra DB en Docker
POSTGRES_SERVER=localhost POSTGRES_PORT=5433 \
uv run alembic upgrade head
```

---

## Arquitectura y patrones clave

### Flujo de trabajo obligatorio (Vertical Slice)

**DB → API → OpenAPI → cliente ng-openapi → UI**

Para cada feature: migración Alembic → endpoint FastAPI con schemas Pydantic → regenerar cliente → UI conectada → lint pasan → docs actualizados.

### Dos layouts en el frontend

| Layout | Ruta | Ubicación | Descripción |
|---|---|---|---|
| **Landing** | `/` | `features/landing/landing.ts` | Público, con navbar + footer propios. Sub-rutas: `/`, `/products`, `/resources`, `/about` |
| **Dashboard** | `/dashboard` | `layouts/layout.component.ts` | Autenticado (`authGuard`), con sidebar + topbar de Velzon |

La landing tiene su propio layout independiente (`layouts/navbar/`, `layouts/footer/`). Los bloques `layouts/esg/` y `layouts/rep/` son secciones de la landing, no del dashboard. Cada uno tiene su propio `.scss` a nivel de componente.

### Backend

**Dependencias de auth en endpoints:**
```python
from app.api.deps import SessionDep, CurrentUser, get_current_active_superuser

@router.get("/me")
async def read_me(current_user: CurrentUser) -> UserMeResponse:
    return UserMeResponse.model_validate(current_user)
```

**CRUD de usuario:**
```python
from app.crud.user import crud_user
user = await crud_user.get_by_email(session, email=email)
user = await crud_user.create(session, obj_in=UserCreate(...))
```

**Errores HTTP con constantes:**
```python
from app.core.messages import MSG
raise HTTPException(status_code=400, detail=MSG.AUTH.INVALID_CREDENTIALS)
```

### Frontend

**Auth service (signals):**
```typescript
readonly auth = inject(AuthService);
auth.user()            // UserMeResponse | null
auth.isAuthenticated() // boolean
```

**Notificaciones:**
```typescript
private notif = inject(NotificationService);
this.notif.success('Operación exitosa.');
this.notif.error(getApiErrorDetail(err));
```

**NgRx Auth actions:**
```typescript
store.dispatch(AuthActions.login({ email, password }));
store.dispatch(AuthActions.logout());
```

### Autenticación (flujo JWT)

- **Access token**: JWT en memoria del cliente, 15 min. Refresh automático vía interceptor HTTP.
- **Refresh token**: httpOnly cookie SameSite=Lax, 7 días, rotación automática. Invalidado en Redis al hacer logout.
- **Payload**: solo `sub=user_id`.

### SCSS del tema

- **Para personalizar colores/variables**: editar `frontend/src/assets/scss/_variables-custom.scss` (no `_variables.scss`)
- Los componentes de la landing usan SCSS co-ubicado junto al `.ts` (e.g., `layouts/esg/esg.scss`)
- Los estilos globales del tema Velzon están en `frontend/src/assets/scss/`
- `velzon/` y `template/` son de solo lectura; copiar/adaptar de ahí hacia `frontend/src/`

### Convención de botones (Bootstrap/Velzon)

| Acción | Clase |
|---|---|
| Agregar/Crear | `btn-success` |
| Editar | `btn-soft-secondary` |
| Eliminar | `btn-soft-danger` |
| Navegación | `btn-primary` / `btn-soft-primary` |
| Cancelar | `btn-soft-danger` / `btn-light` |

---

## Metodología

### Definition of Done (por feature)

- [ ] Migración Alembic generada y aplicada
- [ ] Endpoint con schema Pydantic de request/response
- [ ] Cliente ng-openapi regenerado (`bash scripts/generate-client.sh`)
- [ ] UI conectada al cliente generado
- [ ] `ruff check` y `ng lint` pasan
- [ ] `docs/DECISIONS.md` actualizado si hubo decisión técnica no trivial

### Si hay ambigüedad

Decide priorizando simplicidad/MVP. Documenta en `docs/DECISIONS.md` con fecha `YYYY-MM-DD`. No bloquees el avance.

---

## Variables de entorno

Copiar `.env.example` a `.env`. Variables clave:

```env
DATABASE_URL=postgresql+asyncpg://...
SECRET_KEY=...          # openssl rand -hex 32
REDIS_URL=redis://:password@redis:6379/0
MINIO_ENDPOINT=...
FIRST_SUPERUSER=admin@circula.co
FIRST_SUPERUSER_PASSWORD=...
```
