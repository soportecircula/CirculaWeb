# AI_INDEX — CirculaWeb

## Propósito del proyecto
Plataforma REP (Responsabilidad Extendida del Productor) para Circula Colombia S.A.S.
Gestión de ciclo de vida de productos, cumplimiento normativo y reportes REP.

## Documentos clave

| Documento | Propósito |
|---|---|
| `CLAUDE.md` | Instrucciones y reglas para Claude Code |
| `docs/ARCHITECTURE.md` | Componentes y flujos de la plataforma |
| `docs/DECISIONS.md` | Registro de decisiones técnicas |
| `docs/MILESTONES.md` | Incrementos y estado de avance |
| `docs/BACKEND_GUIDE.md` | Patrones FastAPI + SQLAlchemy |
| `docs/FRONTEND_GUIDE.md` | Patrones Angular + Velzon + ng-openapi |
| `docs/SECURITY.md` | Seguridad y manejo de credenciales |
| `docs/SESSION_2026_04_24.md` | Sesión 2026-04-24: flujo demo→invitación, emails, filtros |
| `docs/SESSION_2026_04_25.md` | Sesión 2026-04-25: logo emails, teléfono en registro, inactividad |

## Reglas globales

1. Branch principal: `main`
2. No multi-tenant: sin business_id, memberships ni impersonación
3. SQLAlchemy 2.x + Alembic (NO SQLModel)
4. Angular 21 standalone + Signals + OnPush
5. Contract-first (OpenAPI → ng-openapi → frontend)
6. Flujo vertical: DB → API → OpenAPI → cliente → UI

## Estado inicial

- Backend: endpoints de auth (login, register, password reset, users/me)
- Frontend: landing pública + login/register/forgot-password/reset-password + dashboard + perfil
- Pendiente: módulos REP (siguiente milestone)
