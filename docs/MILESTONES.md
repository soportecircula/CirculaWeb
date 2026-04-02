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

---

## M1 — Módulo REP inicial

**Objetivo**: primer módulo de gestión REP funcional.

### Por definir según requerimientos:
- [ ] Modelo de Productor (empresa registrada en el sistema REP)
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
