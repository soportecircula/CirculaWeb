# Seguridad — CirculaWeb

## Passwords

- Hash irreversible: **Argon2id** con fallback bcrypt (pwdlib)
- Nunca loggear passwords, tokens ni secrets
- Mínimo 8 caracteres; sin límite máximo práctico (máx. 255 en UI)

## JWT y tokens

- **Access token**: JWT en memoria del cliente (no en localStorage ni cookie). 15 min de vida.
- **Refresh token**: httpOnly cookie SameSite=Lax. 7 días. Rotación automática en cada uso.
- **Payload**: solo `sub=user_id`. Sin datos sensibles en el token.
- Refresh token invalidado en logout (eliminado en Redis).

## Roles

- `User.is_superuser`: acceso super admin (global)
- Usuarios normales: solo acceso a sus propios datos (`/users/me`)

## PII

- Datos de usuario: email, nombre completo, avatar
- Evitar logs con PII. No loggear emails en producción a nivel DEBUG
- Avatares almacenados en MinIO (no en filesystem del contenedor)

## Rate limiting

- Login por IP: 5 requests / minuto (slowapi — `@limiter.limit("5/minute")`)
- Login por email: **5 intentos fallidos → bloqueo de 5 minutos** (Redis, `app/core/login_limiter.py`)
  - Contador en `circula:{env}:login_fails:{email}`; bloqueo en `circula:{env}:login_block:{email}`
  - Reset automático tras login exitoso (`login_limiter.reset_fails`)
  - Fail-open: si Redis no responde, el login continúa sin bloquear
  - Para desbloquear manualmente: `DEL circula:local:login_block:{email}`
- Endpoints públicos protegidos con límites conservadores

## Secrets y configuración

- Todos los secrets vía variables de entorno (`.env`)
- `.env` en `.gitignore` — usar `.env.example` como referencia
- `SECRET_KEY` generado con `openssl rand -hex 32`
- `MINIO_ROOT_PASSWORD` y `REDIS_PASSWORD` generados aleatoriamente

## CORS

- En producción: solo origenes en `BACKEND_CORS_ORIGINS`
- En desarrollo: `http://localhost:4200` habilitado vía `compose.override.yml`

## Auditoría

- Cambios de contraseña: loggear timestamp (sin la contraseña)
- Accesos con tokens inválidos: loggear IP + timestamp

## Checklist de seguridad para nuevas features

- [ ] ¿El endpoint valida que el usuario autenticado solo accede a sus propios datos?
- [ ] ¿Los inputs tienen `maxlength` en frontend y `max_length` en Pydantic?
- [ ] ¿Los archivos subidos validan tipo MIME y tamaño?
- [ ] ¿Las queries usan parámetros (no f-strings) para evitar SQL injection?
- [ ] ¿Los errores HTTP no exponen detalles internos en producción?
