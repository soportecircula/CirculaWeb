# Backend Guide — FastAPI + SQLAlchemy + Alembic (CirculaWeb)

## Stack

- Python 3.12+ gestionado con **UV**
- FastAPI + Pydantic v2
- SQLAlchemy 2.x (modelos declarativos, `mapped_column`, `Mapped`)
- Alembic para migraciones
- PostgreSQL 17
- Redis 7 (caché + rate limiting)
- MinIO (S3) para archivos
- pwdlib (Argon2id + bcrypt fallback)
- slowapi para rate limiting

## Reglas

- **NO SQLModel** — usar SQLAlchemy 2.x puro
- **Contract-first**: todo endpoint tiene schema Pydantic de request/response
- Sin multi-tenant: no filtrar por `business_id`, no validar memberships
- Password hashing irreversible (Argon2id). Nunca loggear passwords ni tokens
- Validaciones server-side siempre

## Estructura

```
backend/app/
├── api/
│   ├── deps.py          # SessionDep, CurrentUser, get_current_active_superuser
│   ├── main.py          # api_router con 4 routers: login, auth, users, utils
│   └── routes/
│       ├── auth.py      # logout (revoca refresh cookie)
│       ├── login.py     # access-token, refresh, recover, reset
│       ├── users.py     # /me CRUD + register + password
│       └── utils.py     # health-check, test-email
├── core/
│   ├── config.py        # Settings (pydantic-settings)
│   ├── security.py      # create_token, verify_token, hash_password, verify_password
│   ├── rate_limit.py    # limiter (slowapi)
│   ├── redis.py         # redis_client, keys helpers
│   └── init_minio.py   # ensure_bucket
├── crud/
│   └── user.py          # get_by_email, create, update, authenticate
├── db/
│   ├── base.py          # DeclarativeBase
│   └── session.py       # engine, async_session
├── models/
│   ├── base.py          # TimestampMixin
│   └── user.py          # User model
├── schemas/
│   ├── common.py        # Message, PaginatedResponse
│   ├── token.py         # Token, TokenPayload, RefreshTokenPayload
│   └── user.py          # UserCreate, UserUpdate, UserMeResponse, UpdatePassword
├── alembic/             # migraciones
├── main.py              # FastAPI app + lifespan + CORS + rate limit
├── utils.py             # email helpers, password reset token
├── backend_pre_start.py
└── initial_data.py      # _ensure_superuser
```

## Patrones clave

### Dependencias de auth

```python
from app.api.deps import SessionDep, CurrentUser, get_current_active_superuser

@router.get("/me")
async def read_me(current_user: CurrentUser) -> UserMeResponse:
    return UserMeResponse.model_validate(current_user)

@router.post("/admin-only")
async def admin_route(_: CurrentUser = Depends(get_current_active_superuser)):
    ...
```

### CRUD de usuario

```python
from app.crud.user import crud_user

user = await crud_user.get_by_email(session, email=email)
user = await crud_user.authenticate(session, email=email, password=password)
user = await crud_user.create(session, obj_in=UserCreate(...))
user = await crud_user.update(session, db_obj=user, obj_in=UserUpdate(...))
```

### Mensajes de error

Los errores HTTP usan constantes de `app.core.messages`:

```python
from app.core.messages import MSG
raise HTTPException(status_code=400, detail=MSG.AUTH.INVALID_CREDENTIALS)
```

## Flujo de migraciones

```bash
cd backend
# Generar migración
uv run alembic revision --autogenerate -m "descripcion"
# Aplicar
uv run alembic upgrade head
# Estado
uv run alembic current
```

## Variables de entorno clave

```env
DATABASE_URL=postgresql+asyncpg://...
SECRET_KEY=...
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
REDIS_URL=redis://:password@redis:6379/0
MINIO_ENDPOINT=...
MINIO_BUCKET=circula
SMTP_HOST=...
EMAILS_FROM_EMAIL=...
FIRST_SUPERUSER=admin@circula.co
FIRST_SUPERUSER_PASSWORD=...
```
