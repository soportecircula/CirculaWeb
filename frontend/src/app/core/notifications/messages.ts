/**
 * Mensajes unificados en español para BE/FE.
 */
export const MSG = {
  // Auth / Login
  INCORRECT_EMAIL_PASSWORD: 'Correo o contraseña incorrectos',
  INACTIVE_USER: 'Usuario inactivo',
  INVALID_TOKEN: 'Token inválido o expirado',
  PASSWORD_UPDATED: 'Contraseña actualizada correctamente',
  PASSWORD_RESET_SENT: 'Si el correo está registrado, te enviamos un enlace para restablecer la contraseña',
  LOGGED_OUT: 'Sesión cerrada',

  // Usuarios
  USER_NOT_FOUND: 'Usuario no encontrado',
  USER_EMAIL_EXISTS: 'Ya existe un usuario con este correo',
  USER_DELETED: 'Usuario eliminado',
  INCORRECT_PASSWORD: 'Contraseña actual incorrecta',
  SAME_PASSWORD: 'La nueva contraseña no puede ser igual a la actual',
  SUPERUSER_NO_DELETE_SELF: 'Los superusuarios no pueden eliminarse a sí mismos',
  CANNOT_DELETE_ACTIVE_USER: 'No se puede eliminar un usuario activo. Desactívalo primero.',

  // Permisos
  INSUFFICIENT_PRIVILEGES: 'No tienes permisos suficientes',

  // Genéricos
  ERROR_GENERIC: 'Ha ocurrido un error. Intenta de nuevo.',
  SAVE_ERROR: 'Error al guardar',
  LOAD_ERROR: 'Error al cargar los datos',
  DELETE_ERROR: 'Error al eliminar',
} as const;

export function getApiErrorDetail(err: unknown): string {
  const detail = (err as { error?: { detail?: string | string[] } })?.error?.detail;
  if (!detail) return MSG.ERROR_GENERIC;
  if (Array.isArray(detail)) return detail[0] ?? MSG.ERROR_GENERIC;
  return String(detail);
}
