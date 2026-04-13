# DECISIONS LOG — CirculaWeb

Registra aquí decisiones técnicas y de producto que afecten arquitectura o experiencia.

Formato:
- YYYY-MM-DD — Título
  - Decisión:
  - Alternativas consideradas:
  - Motivo:
  - Impacto:

---

## 2026-04-01 — Rama principal

- Decisión: la rama principal es **main**.
- Motivo: estándar moderno para proyectos nuevos.
- Impacto: PRs contra `main`; naming `feat/*`, `fix/*`, `chore/*`.

## 2026-04-01 — ORM (SQLAlchemy)

- Decisión: **SQLAlchemy 2.x + Alembic**, NO SQLModel.
- Alternativas: SQLModel, Django ORM.
- Motivo: mayor control arquitectónico, patterns tipados, flexibilidad a largo plazo.
- Impacto: migraciones explícitas con Alembic; modelos declarativos en `backend/app/models/`.

## 2026-04-01 — Frontend (Angular 21 + NgRx clásico)

- Decisión: Angular 21 standalone + Signals. NgRx clásico para auth + layout.
- Alternativas: SignalStore para todo.
- Motivo: base sólida conocida. Migración a SignalStore cuando haya más features.
- Impacto: store/Authentication + store/Layout con actions/reducers/effects/selectors.

## 2026-04-01 — Generación de cliente OpenAPI

- Decisión: usar **ng-openapi** para generar el cliente Angular desde el OpenAPI del backend.
- Motivo: cliente Angular-first, código limpio, integración simple con interceptores.
- Impacto: scripts en `scripts/generate-client.sh`. Nunca editar `frontend/src/client/` manualmente.

## 2026-04-01 — Landing pública sin auth

- Decisión: la ruta `/` muestra una landing page accesible sin autenticación.
- Motivo: presentar la plataforma a nuevos usuarios y ofrecer CTAs de login/registro.
- Impacto: `app.routes.ts` tiene `path: ''` sin `canActivate: [authGuard]`.

## 2026-04-01 — Almacenamiento de imágenes: MinIO

- Decisión: avatares en MinIO (bucket `circula`). URL servidas por backend como proxy o URL directa firmada.
- Motivo: consistencia con deploy en producción; evitar archivos locales en contenedor.
- Impacto: `MINIO_BUCKET=circula` en `.env`.
