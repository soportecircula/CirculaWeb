# 🧾 Épica: Landing Page

Esta épica se encarga de la creación de la landing page de Circula.
Actor: Visitante (usuario no autenticado)

## 📋 Historias de Usuario

### HU-L01: Navegar entre secciones

Como visitante, quiero usar la barra de navegación para ir a las distintas secciones de la landing, para encontrar la información que necesito.

**Story Points: 3**

#### Criterios de Aceptación

- [x] La navbar muestra los enlaces: Inicio(/), Servicios(/products), Nosotros(/about), Recursos(/resources).
- [x] El enlace activo se marca visualmente con la clase active.
- [x] En móvil, un botón hamburguesa despliega/oculta el menú.
- [x] Al hacer clic en un enlace desde el menú móvil, el menú se cierra automáticamente.

### HU-L02: Conocer la propuesta de valor en el inicio

Como visitante, quiero ver en la página de inicio una descripción clara de qué hace Circula y cómo genera valor, para decidir si la plataforma es relevante para mi empresa.

**Story Points: 5**

#### Criterios de Aceptación

- [x] Se muestra un hero con video de fondo y un titular principal sobre la propuesta de valor.
- [x] Existe una columna derecha con tres tarjetas: "Integramos la cadena", "Estandarizamos la evidencia", "Escalamos sostenibilidad".
- [x] Hay una sección "El Problema / La Solución" que explica el diferenciador competitivo.
- [x] Se muestran los botones "Solicitar demo" e "Iniciar sesión" en el hero.

### HU-L03: Ver métricas de impacto

Como visitante, quiero ver cifras reales del impacto de Circula, para tener confianza en la escala y trayectoria de la empresa.

**Story Points: 8**

#### Criterios de Aceptación

- [x] Al hacer scroll hasta la sección de impacto, los contadores se animan desde 0 hasta el valor real (efecto easing).
- [x] Si los datos aún están cargando se muestran skeletons en lugar de números vacíos.
- [x] Las cifras se actualizan automáticamente desde la base de datos.
- [x] Si la API falla, se muestra un mensaje de error en lugar de romper la página.
- [x] Cada métrica muestra: unidad, valor numérico, etiqueta y descripción opcional.

### HU-L04: Ver el slider de marcas aliadas

Como visitante, quiero ver las marcas o empresas aliadas de Circula, para tener una referencia del ecosistema con el que trabajan.

**Story Points: 3**

#### Criterios de Aceptación

- [x] Se muestra un slider infinito y continuo con los logos de marcas.
- [x] El slider se mueve automáticamente de izquierda a derecha.
- [x] El slider se detiene cuando el usuario pasa el mouse sobre él.
- [x] El slider continúa cuando el usuario retira el mouse de él.

### HU-L05: Conocer los servicios ofrecidos

Como visitante, quiero acceder a la sección de Servicios, para entender en detalle qué ofrece la plataforma a productores y empresas.

**Story Points: 2**

#### Criterios de Aceptación

- [x] La ruta /products carga la vista de servicios.
- [x] Incluye el botón "Agendar demo" como llamada a la acción principal.

### HU-L06: Conocer el equipo y la empresa

Como visitante, quiero acceder a la sección "Nosotros", para saber quiénes están detrás de Circula y cuál es su misión.

**Story Points: 2**

#### Criterios de Aceptación

- [x] La ruta /about carga la vista de nosotros.
- [x] Incluye el slider de marcas/aliados.

### HU-L07: Enviar un mensaje de contacto

Como visitante, quiero llenar un formulario de contacto en la sección Recursos, para comunicarme con Circula y solicitar información o soporte.

**Story Points: 5**

#### Criterios de Aceptación

- [x] El formulario incluye: nombre, empresa, tipo de requerimiento, teléfono, correo y mensaje (opcional).
- [x] Cada campo valida en tiempo real al perder el foco o al intentar enviar.
- [x] Mensajes de error específicos por tipo de validación (requerido, formato, longitud).
- [x] Si ya existe una solicitud pendiente o una cuenta activa con ese correo, el sistema lo informa sin enviar duplicados.
- [x] Mientras se envía, el botón muestra estado de carga.
- [x] Al enviar exitosamente, se muestra un mensaje de confirmación y el formulario desaparece.
- [x] Si hay error de API, se muestra el mensaje de error recibido del servidor.

### HU-L08: Acceder a redes sociales de Circula

Como visitante, quiero encontrar los enlaces a las redes sociales de Circula desde el footer, para seguir su actividad.

**Story Points: 1**

#### Criterios de Aceptación

- [x] El footer incluye enlaces a Facebook, Instagram y LinkedIn.
- [x] Cada enlace abre en una pestaña nueva (target="\_blank" con rel="noopener noreferrer").
- [x] Los iconos son clicables y visualmente distinguibles.

### HU-L09: Agendar una demo desde cualquier punto de la landing

Como visitante interesado, quiero poder agendar una demo haciendo clic en el botón "Agendar DEMO" desde cualquier sección, para ser llevado directamente al formulario de contacto.

**Story Points: 2**

#### Criterios de Aceptación

- [x] El botón "Agendar DEMO" en navbar, hero y secciones de servicios navega a /resources#demo-section.
- [x] Al llegar a la URL con fragmento, la vista hace scroll automáticamente hasta el formulario.
- [x] El botón tiene dos variantes visuales: navbar y hero.

### HU-L10: Explorar los servicios disponibles

Como visitante, quiero ver una descripción general de los servicios que ofrece Circula, para entender si la plataforma cubre las necesidades de mi empresa.

**Story Points: 3**

#### Criterios de Aceptación

- [x] La página muestra un encabezado con título y descripción de la propuesta comercial.
- [x] Una tarjeta principal explica el enfoque "REP hoy, ESG mañana" con tres servicios resumidos: Consultoría REP, Software y membresías, Operación y certificación.
- [x] Incluye el botón "Agendar demo" como llamada a la acción principal.
- [x] Hay un enlace "Ver soluciones" que hace scroll interno hasta la sección #soluciones.

### HU-L11: Comparar planes disponibles

Como visitante, quiero ver una tabla comparativa de los planes de Circula, para identificar cuál se ajusta mejor a mi tipo de empresa y necesidades.

**Story Points: 5**

#### Criterios de Aceptación

- [x] Se muestran cuatro planes: Diagnóstico REP, Plan Individual, Plan Colectivo, Arquitectura ESG.
- [x] Cada plan tiene nombre, descripción y un botón "Agendar DEMO".
- [x] Una tabla comparativa muestra qué funciones están habilitadas en cada plan.
- [x] Al pie de la tabla hay una nota aclarando que cada solución puede configurarse según el cliente.

### HU-L12: Ver el detalle de cada servicio

Como visitante, quiero leer una descripción detallada de cada servicio, para saber exactamente qué incluye antes de contactar al equipo comercial.

**Story Points: 3**

#### Criterios de Aceptación

- [x] La sección #soluciones muestra seis tarjetas de servicio: Consultoría REP, Software y membresías, Operación y trazabilidad, Transformación y certificación, Plan colectivo y marketplace, ESG y cultura ambiental.
- [x] Cada tarjeta tiene ícono, título, descripción y lista de ítems incluidos.

### HU-L13: Conocer la misión y visión de Circula

Como visitante, quiero leer la misión y visión de la empresa, para evaluar si sus valores están alineados con los de mi organización.

**Story Points: 2**

#### Criterios de Aceptación

- [x] Se muestran dos tarjetas: Misión y Visión, cada una con ícono y texto descriptivo.
- [x] Hay un encabezado con badge "NUESTRA ESENCIA" y descripción introductoria.

### HU-L14: Conocer el equipo

Como visitante, quiero ver quiénes están detrás de Circula, para evaluar la credibilidad y experiencia del equipo.

**Story Points: 2**

#### Criterios de Aceptación

- [x] Se muestra una sección "EL EQUIPO" con tarjetas de tres miembros: Diana Erazo (Co-Founder & Gerente Sostenibilidad), David Salazar (Co-Founder & Gerente General), Alexander Yamá (Líder de Tecnología)
- [x] Cada tarjeta muestra foto, nombre y cargo
- [x] Las imágenes usan loading="lazy" para no penalizar el rendimiento inicial.

### HU-L15: Explorar los recursos de soporte disponibles

Como visitante o cliente, quiero ver qué tipo de soporte ofrece Circula, para saber dónde acudir si necesito ayuda con la plataforma.

**Story Points: 2**

#### Criterios de Aceptación

- [x] Se muestran tres ítems: Soporte tecnológico, Entrenamiento de la tecnología, Prensa.
- [x] Cada ítem tiene ícono, título y descripción breve.
- [x] Los ítems son navegables (elementos <a>), aunque las rutas aún no están definidas (routerLink="#").

### HU-L16: Acceder a información legal desde el footer

Como visitante, quiero encontrar los enlaces de políticas y términos de uso en el footer, para poder consultarlos si lo necesito.

**Story Points: 1**

#### Criterios de Aceptación

- [x] El footer muestra los enlaces "Nuestras Políticas" y "Términos y Condiciones" bajo la sección "Legal".
- [ ] Pendiente: ambos enlaces tienen routerLink="" sin ruta real asignada.

# 🧾 Épica: Autenticación

Esta épica se encarga de la autenticación de usuarios en la plataforma.
Actores: Usuario registrado/no registrado

## 🔐 Historias de Usuario

### HU-A01: Registrarse en la plataforma

Como usuario registrado, quiero ingresar a la plataforma con mi correo y contraseña, para acceder al dashboard y gestionar mis obligaciones REP.

**Story Points: 3**

#### Criterios de Aceptación

- [x] El formulario tiene dos campos: correo electrónico y contraseña.
- [x] Mientras se procesa el login, el botón muestra un spinner y queda deshabilitado.
- [x] Si las credenciales son correctas, el usuario es redirigido al dashboard (/dashboard).
- [x] Si las credenciales son incorrectas, se muestra una notificación de error con el mensaje recibido del servidor.
- [x] Hay un enlace "← Volver" que regresa a la landing (/).
- [x] La sesión persiste automáticamente mediante refresh token en cookie httpOnly (7 días), sin necesidad de volver a iniciar sesión en cada visita.

### HU-A02: Mostrar/ocultar contraseña

Como usuario, quiero poder ver o esconder el texto de mi contraseña mientras la escribo, para evitar errores de tipeo sin comprometer mi seguridad.

**Story Points: 1**

#### Criterios de Aceptación

- [x] El campo de contraseña tiene un botón icono a la derecha.
- [x] Al hacer clic, el campo alterna entre type="password" y type="text".
- [x] El ícono cambia visualmente según el estado (ojo abierto / ojo cerrado).
- [x] El botón tiene tabindex="-1" para no interrumpir el flujo del teclado.

### HU-A03: Recordar sesión

Como usuario, quiero que mi sesión se mantenga activa al volver a la plataforma, para no tener que ingresar mis credenciales en cada visita.

**Story Points: 2**

#### Criterios de Aceptación

- [x] Al iniciar sesión exitosamente, el servidor emite un refresh token en cookie httpOnly con duración de 7 días.
- [x] Si el usuario cierra y vuelve a abrir el navegador, la sesión se restaura automáticamente mediante el refresh token (sin pantalla de login).
- [x] El access token en memoria se renueva automáticamente mediante el interceptor HTTP antes de expirar (15 minutos).
- [x] Al hacer logout, el refresh token es invalidado en Redis y la cookie eliminada.

### HU-A04: Recuperar contraseña

Como usuario que olvidó su contraseña, quiero poder restablecerla mediante mi correo registrado, para recuperar el acceso a la plataforma sin contactar a soporte.

**Story Points: 5**

#### Criterios de Aceptación

#### Paso 1 - Solicitar enlace (/auth/forgot-password)

- [x] El formulario solicita únicamente el correo electrónico.
- [x] El botón está deshabilitado si el email es inválido o mientras se envía.
- [x] Al enviar, siempre se muestra el mensaje de éxito (independientemente de si el correo existe), para no revelar si un email está registrado.
- [x] El formulario desaparece y se muestra el mensaje de confirmación en su lugar.
- [x] Hay un enlace "Clic aquí" para volver al login si el usuario recuerda su contraseña.

#### Paso 2 - Restablecer contraseña (/auth/reset-password?token=...)

- [x] Si el token en la URL es inválido o está ausente, se muestra un mensaje de error con enlace para solicitar uno nuevo.
- [x] El token se elimina de la URL al cargar (sin recarga, usando replaceUrl), para no exponerlo en el historial del navegador.
- [x] El formulario tiene dos campos: nueva contraseña y confirmar contraseña, ambos con toggle de visibilidad.
- [x] Se muestra un indicador visual en tiempo real que valida si la contraseña tiene al menos 8 caracteres.
- [x] Si las contraseñas no coinciden y el campo de confirmación fue tocado, se muestra el error "Las contraseñas no coinciden".
- [x] Al restablecer exitosamente, el formulario se reemplaza por un mensaje de éxito y un botón "Ir al Login".

### HU-A05: Bloqueo por intentos fallidos

Como sistema, quiero limitar los intentos de login fallidos consecutivos, para proteger las cuentas contra ataques de fuerza bruta.

**Story Points: 3**

#### Criterios de Aceptación

- [x] El endpoint POST /api/v1/login/access-token está limitado a 5 intentos por minuto por IP.
- [x] El endpoint POST /password-recovery/{email} está limitado a 3 solicitudes por minuto.
- [x] Si se supera el límite, el servidor responde con HTTP 429 (Too Many Requests).
- [x] El frontend muestra el mensaje de error recibido del servidor al superar el límite.
- [x] El bloqueo se libera automáticamente al expirar la ventana de tiempo (1 minuto).

### HU-A06: Recibir confirmación de la solicitud por correo

Como solicitante, quiero recibir un correo confirmando que mi solicitud fue recibida, para saber que el proceso está en curso y cuándo esperar una respuesta.

**Story Points: 2**

#### Criterios de Aceptación

- [x] Al enviar el formulario, el sistema envía automáticamente un correo al solicitante desde noreply@grupocircula.com.
- [x] El correo indica que la solicitud fue recibida y que el equipo se comunicará pronto.
- [x] El correo no se reenvía si la misma dirección ya tiene una solicitud activa

### HU-A07: Completar registro desde el link de invitación

Como solicitante aprobado, quiero acceder al link que recibí por correo para crear mi contraseña y activar mi cuenta, para poder ingresar a la plataforma.

**Story Points: 5**

#### Criterios de Aceptación

- [x] El link lleva a /auth/register?token=....
- [x] El nombre completo aparece pre-cargado con el valor ingresado en la solicitud (editable).
- [x] El formulario solicita únicamente: contraseña y confirmar contraseña.
- [x] La contraseña debe tener mínimo 8 caracteres; se muestra un indicador visual en tiempo real.
- [x] Si las contraseñas no coinciden, se muestra el error "Las contraseñas no coinciden".
- [x] Al completar el registro exitosamente, la cuenta queda activa y el usuario es redirigido al dashboard (/dashboard).
- [x] La ruta /auth/register sin token válido redirige a /auth/login.

### HU-A08: Manejar link de invitación inválido o expirado

Como solicitante, quiero recibir un mensaje claro cuando el link de registro ya no es válido, para saber qué hacer en lugar de quedarme en una pantalla de error.

**Story Points: 2**

#### Criterios de Aceptación

- [x] Si el token está ausente, se muestra el mensaje: "El link de registro no es válido. Contacta a soporte."
- [x] Si el token ya expiró (más de 72 horas), se muestra: "Este link ha expirado. Contacta al equipo de Circula para solicitar uno nuevo."
- [x] Si el token ya fue utilizado (cuenta ya creada), se muestra: "Esta invitación ya fue utilizada." con un enlace al login.
- [x] En ningún caso se muestra el formulario de registro si el token no es válido.

### HU-A09: Recibir notificación de la solicitud aprobada por correo

Como solicitante aprobado, quiero acceder al link que recibí por correo para crear mi contraseña y activar mi cuenta, para poder ingresar a la plataforma.

**Story Points: 2**

#### Criterios de Aceptación

- [x] Al aprobar una solicitud, el sistema envía automáticamente un correo al usuario.
- [x] El correo contiene un link único de registro (/auth/register?token=...).
- [x] El correo indica que fue aprobado y puede completar su registro.
- [x] El link tiene una vigencia de 72 horas.
- [x] El correo se envía desde noreply@grupocircula.com.

# 🧾 Épica: Administración de Solicitudes

> **BORRADOR — Pendiente de aprobación del PO tras reunión con interesados.**
> Esta épica cubre la interfaz de administrador para gestionar las solicitudes de contacto/demo recibidas desde la landing. Actualmente el formulario de contacto envía el email pero **no persiste en BD**, por lo que esta épica también requiere un ajuste en el backend.

Actor: Administrador (superusuario)

## 🗂️ Historias de Usuario

### HU-ADM01: Ver solicitudes pendientes

Como administrador, quiero ver la lista de solicitudes de contacto pendientes, para gestionarlas en orden de llegada.

**Story Points: 5**

#### Criterios de Aceptación

- [ ] Al enviar el formulario de contacto, los datos se persisten en BD con estado `PENDING`.
- [ ] La ruta /dashboard/admin/solicitudes lista las solicitudes con filtro por estado (Pendiente / Aprobada / Rechazada).
- [ ] Cada fila muestra: nombre, empresa, tipo de requerimiento, correo, fecha de envío y estado.
- [ ] La sección solo es visible en el sidebar si el usuario es superusuario.

### HU-ADM02: Aprobar una solicitud

Como administrador, quiero aprobar una solicitud, para que el solicitante reciba automáticamente el link de registro.

**Story Points: 3**

#### Criterios de Aceptación

- [ ] Al aprobar, el sistema genera un token de invitación único con vigencia de 72 horas.
- [ ] Se envía automáticamente el correo de aprobación con el link /auth/register?token=... (HU-A09).
- [ ] El estado de la solicitud cambia a `APPROVED` y queda registrado quién aprobó y cuándo.
- [ ] No se puede aprobar una solicitud ya aprobada o rechazada.

### HU-ADM03: Rechazar una solicitud

Como administrador, quiero rechazar una solicitud con una nota opcional, para informar al solicitante del motivo.

**Story Points: 3**

#### Criterios de Aceptación

- [ ] Al rechazar, el administrador puede ingresar una nota interna (opcional, max 300 chars).
- [ ] El estado de la solicitud cambia a `REJECTED` y queda registrado quién rechazó y cuándo.
- [ ] Se envía un correo de notificación al solicitante informando que su solicitud no fue aprobada.
- [ ] No se puede rechazar una solicitud ya aprobada o rechazada.
