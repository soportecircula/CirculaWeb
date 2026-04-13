# Arquitectura — CirculaWeb

## Componentes
- **Frontend**: Angular 21 (Signals + NgRx) servido por Nginx
- **Backend**: FastAPI + SQLAlchemy 2.x + Alembic
- **DB**: PostgreSQL 17
- **Cache**: Redis 7
- **Storage**: MinIO (S3-compatible) para archivos
- **Deploy**: Docker Compose (archivos en raíz). Sin carpeta `infra/`

## Stack completo

```
Internet → Traefik (TLS) → Nginx (frontend) → Angular
                         → FastAPI (backend) → PostgreSQL
                                             → Redis
                                             → MinIO
```

## Dominios del sistema

- **Auth**: registro, login, reset de contraseña, cambio de contraseña
- **Users**: perfil del usuario (email, nombre, avatar)
- **REP** *(futuro)*: módulos de Responsabilidad Extendida del Productor

## Autenticación

- **Access token**: JWT en memoria, 15 min de vida
- **Refresh token**: httpOnly cookie, 7 días de vida, rotación automática
- **Hashing**: Argon2id con fallback bcrypt (pwdlib)
- **JWT payload**: solo `sub=user_id` (sin tenant)

## Rutas API

```
POST /api/v1/login/access-token
POST /api/v1/login/refresh
POST /api/v1/login/recover-password
POST /api/v1/login/reset-password
GET  /api/v1/users/me
PUT  /api/v1/users/me
POST /api/v1/users/register
PATCH /api/v1/users/me/password
GET  /api/v1/auth/logout
GET  /api/v1/utils/health-check
POST /api/v1/utils/test-email
```

## Rutas Frontend

```
/                     Landing pública (sin auth)
/auth/login           Login
/auth/register        Registro
/auth/forgot-password Recuperar contraseña
/auth/reset-password  Nueva contraseña (token)
/dashboard            Dashboard (requiere auth)
/dashboard/profile    Perfil
/dashboard/change-password  Cambiar contraseña
```

## Flujos clave

### Login
Frontend → POST /api/v1/login/access-token → JWT en memoria
Refresh automático vía interceptor (refresh token en cookie httpOnly)

### Registro
Frontend → POST /api/v1/users/register → email de confirmación (futuro)

### Reset de contraseña
1. POST /api/v1/login/recover-password (envía email con token)
2. POST /api/v1/login/reset-password (usa token del email)
