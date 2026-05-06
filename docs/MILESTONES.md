# MILESTONES — CirculaWeb

## M0 — Estructura base (COMPLETADO)

**Objetivo**: Repo funcional con auth end-to-end.

### Backend
- [x] Modelos: User (is_superuser, email, full_name, avatar_url, hashed_password)
- [x] Endpoints de auth: login, refresh, logout, recover-password, reset-password
- [x] Endpoints de usuario: /me GET/PUT, register, change-password
- [x] Alembic configurado
- [x] Redis (rate limiting)
- [x] MinIO (bucket circula)
- [x] Email: new_account, reset_password, test_email
- [x] initial_data.py: crea superuser al iniciar

### Frontend
- [x] Landing pública (/)
- [x] Login / Register / Forgot Password / Reset Password
- [x] Dashboard (protegido, bienvenida)
- [x] Perfil (/dashboard/profile)
- [x] Cambiar contraseña (/dashboard/change-password)
- [x] Sidebar/Footer/MobileHeader (Velzon layout)
- [x] NgRx auth + layout stores
- [x] Toast notifications

### Infraestructura
- [x] Docker Compose dev (compose.override.yml)
- [x] Docker Compose prod (compose.yml + compose.traefik.yml)
- [x] Scripts: generate-client.sh, init-db.sh
- [x] Deploy backend en Railway (Docker + PostgreSQL + Redis managed)
- [x] Deploy frontend en Vercel (bun build, SPA rewrite)
- [x] Dominio `api.grupocircula.com` → Railway (CNAME + TXT verificado en Hostinger)
- [x] Dominio `www.grupocircula.com` → Vercel
- [x] Email transaccional vía Resend (`noreply@grupocircula.com`)
- [x] Seed de `impact_metrics` en `initial_data.py`
- [x] Formulario de contacto conectado a `ContactService` (ng-openapi)

---

## M0.5 — Flujo Demo → Aprobación → Invitación → Registro (COMPLETADO 2026-04-24)

**Objetivo**: flujo completo para que empresas interesadas soliciten un demo, el superadmin lo gestione y el usuario reciba una invitación de registro.

### Backend
- [x] Modelo `ContactRequest` con estados `PENDING / APPROVED / REJECTED`
- [x] Campo `invite_sent` (timestamp) en `contact_requests`
- [x] Enum `PlanType`: `demo_rep`, `demo_indv`, `demo_col`, `demo_esg`
- [x] Campos en `User`: `plan_type`, `company`, `nit`, `phone`
- [x] Endpoint `POST /contact/requests/{id}/approve`
- [x] Endpoint `POST /contact/requests/{id}/reject` (con nota opcional)
- [x] Endpoint `POST /contact/requests/{id}/send-invite` (genera JWT de invitación, envía correo)
- [x] Endpoint `GET /users/invite-info?token=` (valida token y retorna datos)
- [x] Endpoint `POST /users/register` (registro con token de invitación; elimina `contact_request` tras registro exitoso)
- [x] Token JWT de invitación con claims: `sub` (email), `plan`, `req` (contact_request id), `name`, `company`
- [x] Validación de token único: 409 si el email ya tiene cuenta registrada

### Frontend
- [x] `register.component.ts` / `register.html`: modo normal + modo invitado (`isInvitedMode`)
  - Modo invitado: campos empresa/NIT/teléfono requeridos, email pre-rellenado y deshabilitado
  - Banner con el plan asignado
  - Limpiar token de la URL tras cargarlo
- [x] Panel `/dashboard/pending-requests` (solo superadmin):
  - Tabla con Empresa, Contacto, Plan, Estado, Fecha, Acciones
  - Badges de estado con colores semánticos
  - Aprobar / Rechazar (con textarea inline de motivo) / Enviar invitación / Reenviar
  - Spinner por fila durante operaciones
- [x] Dashboard `/dashboard`: grid 4 tarjetas por módulo con acceso según plan
  - Diagnóstico REP → todos los planes
  - Software REP → `demo_indv`, `demo_col`, `demo_esg`
  - Marketplace → `demo_col`, `demo_esg`
  - Infraestructura ESG → solo `demo_esg`
  - Tarjetas bloqueadas con `opacity-50` y botón deshabilitado
- [x] Sidebar dinámico: ítem "Solicitudes" visible solo para superadmin
- [x] `AuthService`: computed signals `canAccessDiagnostico/Software/Marketplace/Esg()`
- [x] NgRx: `selectPlanType` selector

### Seguridad del Login (2026-04-24)
- [x] Checkbox "Recordarme": refresh token cookie persistente (7 días) vs sesión
- [x] Bloqueo por 5 intentos fallidos por email (Redis, 5 min)
- [x] Auto-redirección al dashboard si la sesión sigue activa al visitar `/auth/login`
- [x] Email pre-rellenado en localStorage cuando "Recordarme" está marcado

---

## M1 — Módulo REP inicial (EN PROGRESO)

**Objetivo**: primer módulo de gestión REP funcional.

### Ficha del Productor (COMPLETADO 2026-05-06)

#### Backend
- [x] Modelo `Producer`: razón social, NIT, ciudad, departamento, dirección, correo, contacto, responsable, tipo (fabricante/importador), cuenta con plan, estado, incumplimiento REP
- [x] Modelo `Sector` (catálogo predefinido + `es_predefinido` flag)
- [x] Modelo `NormativeObligation` con seed en `initial_data.py`
- [x] Tabla de asociación `producer_obligations` (muchos-a-muchos `Producer` ↔ `NormativeObligation`)
- [x] Campo `other_sector` en `Producer` para sectores no predefinidos (texto libre, no crea sector nuevo)
- [x] Campo `sector_id` FK a `sectors` (exclusión mutua con `other_sector` vía `model_validator`)
- [x] Endpoints: `GET/PUT /rep/producers/me`, `GET/POST/PUT /rep/producers`, `GET/PATCH /rep/admin/producers/{id}`
- [x] Endpoints catálogo: `GET /rep/sectors`, `POST /rep/sectors`, `GET /rep/obligations`
- [x] CRUD con helper `_apply_obligations()` para manejar la relación M2M

#### Frontend
- [x] Vista `/dashboard/producers` con tarjetas de info + tabla de productores
- [x] Modal agregar/editar con todos los campos del productor
- [x] Dropdown de sector con opción "— Otro —" → campo de texto libre (`other_sector`)
- [x] Checkboxes de obligaciones normativas vinculados por ID (no por nombre)
- [x] Selector de departamento → ciudades dinámicas (`colombia-geo.ts`)
- [x] NgRx store `rep`: sectors, obligations, producers (loading, saving, error)
- [x] `canAddProducer` controlado por plan: `demo_col` y superadmin → N productores; resto → máximo 1
- [x] Validaciones frontend: `contacto` solo dígitos (`Validators.pattern`), `correo` formato email, botón deshabilitado hasta formulario completo + mínimo una obligación seleccionada
- [x] Patrón `hasError(field)` / `getError(field)` en modal (consistente con `resources.ts`)
- [x] Cierre automático del modal + reset del formulario tras guardado exitoso (via `Actions + ofType + takeUntilDestroyed`)
- [x] Tooltip en campo "En incumplimiento REP" con mensaje explicativo (`NgbTooltip`)
- [x] Selección de productor desde tabla → actualiza ficha superior; fila activa resaltada con `table-active`
- [x] Cards con `border-radius: 16px` alineadas al estilo visual Circula

### Por implementar:
- [ ] Reporte de volúmenes (declaración de productos puestos en mercado)
- [ ] Gestión de metas REP
- [ ] Panel de cumplimiento

---

## M2 — Reportes y Trazabilidad

**Objetivo**: generación de reportes para autoridades ambientales.

- [ ] Exportación PDF / Excel de reportes REP
- [ ] Historial de declaraciones
- [ ] Dashboard de cumplimiento con métricas

---

## M3 — Administración avanzada

**Objetivo**: herramientas de super admin para gestionar la plataforma.

- [ ] Gestión de usuarios (lista, activar/desactivar)
- [ ] Audit log de acciones críticas
- [ ] Configuración global de la plataforma
