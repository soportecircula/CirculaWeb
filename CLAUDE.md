# CirculaWeb — Instrucciones para Claude Code

**Propósito**: construir la **Plataforma REP** (Responsabilidad Extendida del Productor) para Circula Colombia S.A.S. con:
- **Web app Angular 21** (dashboard + landing pública).
- **API FastAPI** + PostgreSQL (single-tenant, sin multi-business).
- **Deploy** con Docker Compose en raíz + **Traefik** en producción (TLS).

---

## 0) Reglas hard (NO negociables)

1) **Branch principal**: `main`.
2) **NO existe carpeta `infra/`**.
   - Deploy como el template: `compose.yml`, `compose.override.yml`, `compose.traefik.yml` en la **raíz**.
3) **Backend**: FastAPI + PostgreSQL + **SQLAlchemy 2.x + Alembic** (NO SQLModel).
4) **Frontend**: Angular **21** standalone + Signals (OnPush).
5) **Contract-first**: OpenAPI manda. El frontend consume cliente generado con **ng-openapi**.
6) **Sin multi-business**: no existen conceptos de tenant, business_id, memberships ni impersonación.
7) **NgRx clásico** para auth + layout. Sin SignalStore por ahora.

---

## 1) Fuentes de verdad (lee antes de cambiar código)

- `docs/AI_INDEX.md` — índice y reglas globales
- `docs/DECISIONS.md` — decisiones técnicas
- `docs/MILESTONES.md` — incrementos
- `docs/ARCHITECTURE.md` — componentes y flujos
- `docs/FRONTEND_GUIDE.md` — Angular + Velzon + ng-openapi
- `docs/BACKEND_GUIDE.md` — patrones backend
- `docs/SECURITY.md` — seguridad

---

## 2) Metodología (obligatoria)

### Vertical Slices
Trabaja por slices end‑to‑end:
**DB → API → OpenAPI → cliente ng-openapi → UI**

### Definition of Done (mínimo)
Para cada feature:
- Migración Alembic
- Endpoints con validación
- Cliente ng-openapi regenerado
- UI conectada
- `pre-commit` y lint pasan
- Docs actualizados

---

## 3) Stack y skills esperados

- **Backend**: FastAPI, SQLAlchemy 2.x, Alembic, Pydantic, JWT, Argon2id/bcrypt, Postgres, Redis.
- **Frontend**: Angular 21, Signals, NgRx (clásico), SCSS, Bootstrap/Velzon.
- **DevOps**: Docker/Compose, Nginx, Traefik.

---

## 4) Estructura del repo

```
backend/          FastAPI + SQLAlchemy
frontend/         Angular 21 + Velzon
scripts/          tooling/generación cliente
docs/             especificaciones
compose*.yml      dev/prod/traefik (en raíz)
```

---

## 5) Si hay ambigüedad

- Decide de forma razonable priorizando simplicidad/MVP.
- Documenta la decisión en `docs/DECISIONS.md` con fecha.
- No bloquees el avance por dudas menores.
