"""Mensajes unificados en español para BE/FE."""

# Auth / Login
INCORRECT_EMAIL_OR_PASSWORD = "Correo o contraseña incorrectos"
INACTIVE_USER = "Usuario inactivo"
INVALID_TOKEN = "Token inválido o expirado"
PASSWORD_UPDATED = "Contraseña actualizada correctamente"
PASSWORD_RESET_SENT = "Si el correo está registrado, te enviamos un enlace para restablecer la contraseña"
LOGGED_OUT = "Sesión cerrada"

# Usuarios
USER_NOT_FOUND = "Usuario no encontrado"
USER_EMAIL_EXISTS = "Ya existe un usuario con este correo"
USER_DELETED = "Usuario eliminado"
INCORRECT_PASSWORD = "Contraseña actual incorrecta"
SAME_PASSWORD = "La nueva contraseña no puede ser igual a la actual"
SUPERUSER_NO_DELETE_SELF = "Los superusuarios no pueden eliminarse a sí mismos"
CANNOT_DELETE_ACTIVE_USER = "No se puede eliminar un usuario activo. Desactívalo primero."

# Permisos
INSUFFICIENT_PRIVILEGES = "No tienes permisos suficientes"

# Auth técnicos
COULD_NOT_VALIDATE_CREDENTIALS = "No se pudieron validar las credenciales"
REFRESH_TOKEN_MISSING = "Token de actualización faltante"
INVALID_REFRESH_TOKEN = "Token de actualización inválido"
INVALID_TOKEN_TYPE = "Tipo de token inválido"
USER_NOT_FOUND_OR_INACTIVE = "Usuario no encontrado o inactivo"

# Usuarios (API)
USER_WITH_EMAIL_EXISTS = "Ya existe un usuario con este correo en el sistema"
USER_WITH_ID_NOT_EXISTS = "No existe un usuario con este id en el sistema"

# Upload
FILE_TOO_LARGE = "Archivo demasiado grande"
INVALID_IMAGE_TYPE = "Tipo de archivo no válido. Permitidos: jpeg, png, webp"

# Login limiter
ACCOUNT_LOCKED = "Cuenta bloqueada temporalmente por demasiados intentos fallidos. Inténtalo de nuevo en {minutes} minutos."

# Contact requests
CONTACT_REQUEST_NOT_FOUND = "Solicitud no encontrada"
CONTACT_ALREADY_REVIEWED = "Esta solicitud ya fue revisada"
CONTACT_DUPLICATE_REQUEST = "Ya existe una solicitud activa con este correo. Te contactaremos pronto."
