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

---

## 2026-04-14 — Despliegue en Railway (backend) y Vercel (frontend)

- Decisión: backend en **Railway** con Docker, frontend en **Vercel**.
- Alternativas: Railway para ambos, VPS propio, Render.
- Motivo: Railway soporta Docker nativo y PostgreSQL managed; Vercel es ideal para SPAs Angular (CDN, deploy automático desde `main`).
- Impacto:
  - `railway.toml` en raíz configura build context y Dockerfile del backend.
  - `backend/Dockerfile` usa `uv`, copia `uv.lock` desde raíz, ejecuta `scripts/start.sh`.
  - `backend/scripts/start.sh`: corre `prestart.sh` (migraciones + seed) y luego `fastapi run --port ${PORT:-8000}`.
  - `frontend/vercel.json`: `buildCommand=bun run build`, `outputDirectory=dist/frontend/browser`, rewrite SPA `/(.*) → /index.html`.
  - `frontend/src/environments/environment.prod.ts`: `apiUrl = 'https://api.grupocircula.com'`.
  - ⚠️ `environment.ts` (dev local) debe apuntar a `http://localhost:8000`.

## 2026-04-14 — Dominio personalizado `api.grupocircula.com` en Railway

- Decisión: exponer el backend bajo `api.grupocircula.com` en lugar de la URL generada por Railway.
- Motivo: URL estable y profesional; desacopla el frontend del hostname interno de Railway.
- Impacto:
  - En Railway → Settings → Networking → Custom Domain: `api.grupocircula.com`.
  - En Hostinger DNS: CNAME `api → 6pzhxkm8.up.railway.app` y TXT `_railway-verify.api → railway-verify=...` para verificación de dominio.
  - SSL generado automáticamente por Railway (Let's Encrypt).

## 2026-04-14 — Seed de `impact_metrics` en `initial_data.py`

- Decisión: los datos iniciales de la tabla `impact_metrics` se insertan en `initial_data.py`, no manualmente.
- Motivo: idempotencia — en cada deploy Railway corre `prestart.sh` → `initial_data.py`; si los registros ya existen no los duplica.
- Impacto: `backend/app/initial_data.py` llama a `_ensure_impact_metrics()` con 4 registros base (produc, plan_in_col, opera, tons_rec).

## 2026-04-14 — Reemplazo de `python-emails` por SDK de Resend

- Decisión: envío de correos transaccionales vía **Resend** (SDK oficial) en lugar de la librería `python-emails`.
- Alternativas consideradas: `python-emails` con Gmail SMTP (puerto 587 y 465), `smtplib` directo.
- Motivo: `python-emails` falla silenciosamente en Railway (`SMTPResponse status_code=None`) — problema conocido de la librería con conexiones SSL en entornos cloud. Resend usa HTTPS API, sin dependencia de SMTP.
- Impacto:
  - `uv add resend` → `resend==2.28.0` en `pyproject.toml`.
  - `backend/app/utils.py`: `send_email()` reescrita para usar `resend.Emails.send()`.
  - `backend/app/core/config.py`: nuevo campo `RESEND_API_KEY: str | None`; `emails_enabled` ahora requiere `RESEND_API_KEY` o `SMTP_HOST`.
  - Variable `RESEND_API_KEY` agregada en Railway.
  - Dominio `grupocircula.com` verificado en panel de Resend con registros DNS DKIM + SPF en Hostinger.
  - ⚠️ En dev local, sin `RESEND_API_KEY` en `.env`, el endpoint `/contact/submit` devuelve 503.

## 2026-04-22 — Agendamiento Google Calendar con Domain-Wide Delegation

- Decisión: integrar Google Calendar en el formulario de contacto usando **Service Account con DWD**, sin OAuth interactivo.
- Alternativas consideradas: OAuth2 desktop (requiere login manual periódico), Google Calendar API con API Key (solo lectura pública).
- Motivo: DWD permite impersonar usuarios `@grupocircula.com` desde el backend sin intervención humana; un solo JSON de credenciales en `.env` es suficiente.
- Impacto:
  - Nuevas dependencias: `google-auth>=2.29.0`, `google-api-python-client>=2.126.0`.
  - `backend/app/core/google_calendar.py`: funciones `get_available_slots(date, requirement_type)` y `create_event(...)`.
  - Migración `aff273902683`: columnas `scheduled_at` y `calendar_event_id` en `contact_requests`.
  - Solo solicitudes de tipo **demo** se persisten en DB; `support` e `info` solo envían correo.
  - `info` no tiene selector de horario en el frontend.
  - Slots: lun-vie 8–17 continuo, sáb 8–12, timezone `America/Bogota`.
  - Documentación completa en `docs/GOOGLE_CALENDAR.md`.

## 2026-04-24 — Recordarme: cookie de sesión vs persistente

- Decisión: "Recordarme" controla el `max_age` del refresh token cookie. Sin marcar → session cookie (expira al cerrar el navegador). Marcado → persistent cookie (7 días).
- Alternativas consideradas: guardar el access token en localStorage (rechazado por ser vulnerable a XSS); guardar el refresh token en localStorage (rechazado — solo httpOnly cookie).
- Motivo: mantener la arquitectura de seguridad intacta (access token en memoria, refresh token en httpOnly cookie). Solo cambia la durabilidad del cookie.
- Impacto:
  - `_set_refresh_cookie(persistent: bool)` en `auth.py`.
  - `remember_me: bool = Query(False)` en el endpoint `POST /login/access-token`.
  - En localStorage solo se guarda el email del usuario (para pre-rellenar el campo). Nada sensible.
  - El effect de login usa `HttpClient` directo (no `LoginService` generado) para poder agregar `?remember_me=` al URL sin editar el cliente ng-openapi.

## 2026-04-24 — Bloqueo por intentos fallidos: Redis síncrono por email

- Decisión: contador de intentos fallidos de login por email en Redis. 5 intentos → bloqueo de 5 minutos. Reset tras login exitoso.
- Alternativas consideradas: slowapi por IP (ya existe pero es global, no por email); contador en base de datos (costoso, no es el propósito); en memoria del proceso (no funciona con múltiples workers).
- Motivo: el bloqueo por IP en slowapi no distingue entre un usuario legítimo y un atacante con la misma IP (ej. redes corporativas). El bloqueo por email es más preciso y justo.
- Impacto:
  - Nuevo módulo `app/core/login_limiter.py` con cliente Redis **síncrono** (`redis.Redis`) para no romper el endpoint síncrono de FastAPI.
  - Fail-open: si Redis no responde, el login continúa sin bloquear.
  - Claves: `circula:{env}:login_fails:{email}` y `circula:{env}:login_block:{email}`.
  - El endpoint devuelve 429 al bloquearse. El mensaje incluye los minutos de espera con `{minutes}` placeholder.

## 2026-04-24 — Auto-redirección al dashboard con sesión activa

- Decisión: `LoginComponent.ngOnInit()` verifica si la sesión está activa (token en memoria o refresh en curso) y redirige a `/dashboard` sin mostrar el formulario.
- Motivo: con "Recordarme" activado, el cookie persistente permite renovar la sesión automáticamente al abrir el navegador. Sin la redirección, el usuario ve el formulario de login aunque ya esté autenticado.
- Impacto:
  - En `ngOnInit()`: primero revisa `getAccessToken()` (token ya en memoria). Si no, se suscribe a `selectAuthInitialized` y redirige cuando el refresh termina con éxito.
  - Sin "Recordarme" (o cookie expirado): el refresh falla → `initialized=true` sin token → formulario se muestra normalmente.

## 2026-04-14 — Formulario de contacto: migración a `ContactService` (ng-openapi)

- Decisión: el componente `resources.ts` usa `ContactService` generado por ng-openapi en lugar de `HttpClient` con URL relativa.
- Motivo: `HttpClient` con URL relativa (`/api/v1/contact/submit`) enviaba la petición al mismo dominio del frontend (`www.grupocircula.com`), que no tiene ese endpoint → 405 Method Not Allowed. `ContactService` usa `basePath = environment.apiUrl` configurado en `app.config.ts`.
- Impacto: `frontend/src/app/features/landing/resources/resources.ts` importa y usa `ContactService.contactSubmitContactForm()`.
