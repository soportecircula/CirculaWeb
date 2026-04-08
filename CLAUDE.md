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

### Frontend (Angular, gestionado con npm)

```bash
cd frontend

# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:4200)
npm start

# Build de producción
npm run build

# Lint (Angular ESLint)
npm run lint

# Formato (Prettier)
npm run format

# Tests
npm test
```

### Generación del cliente HTTP (requiere backend corriendo en :8000)

```bash
bash scripts/generate-client.sh
```

Esto descarga el `swagger.json` del backend, ejecuta ng-openapi y formatea con Biome. Hacer esto después de cualquier cambio a endpoints o schemas.

### Docker Compose

```bash
# Desarrollo (levanta backend, frontend, postgres, redis, minio)
docker compose -f compose.yml -f compose.override.yml up

# Producción con Traefik
docker compose -f compose.yml -f compose.traefik.yml up -d
```

---

## Arquitectura y patrones clave

### Flujo de trabajo obligatorio (Vertical Slice)

**DB → API → OpenAPI → cliente ng-openapi → UI**

Para cada feature: migración Alembic → endpoint FastAPI con schemas Pydantic → regenerar cliente → UI conectada → lint pasan → docs actualizados.

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
