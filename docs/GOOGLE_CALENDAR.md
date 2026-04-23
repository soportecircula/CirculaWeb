# Google Calendar — Integración de Agendamiento

Sistema de agendamiento de citas integrado en el formulario de contacto de `/resources`.
Permite a usuarios de tipo **demo** y **soporte** elegir un horario al enviar su solicitud.
El evento se crea automáticamente en el calendario del responsable de Circula.

---

## Arquitectura del flujo

```
Usuario llena el formulario → elige tipo de requerimiento
  → (si es demo o support) aparece botón "Elegir horario"
  → abre modal Calendar → selecciona fecha
  → Frontend llama GET /api/v1/contact/slots?date=YYYY-MM-DD&requirement_type=demo_rep
  → Backend impersona al organizador del tipo via Domain-Wide Delegation
  → consulta freebusy de TODOS los asistentes del tipo en Google Calendar
  → retorna slots de 1h donde TODOS están libres
  → usuario selecciona slot → formulario muestra horario elegido
  → usuario envía el formulario (con scheduled_at en ISO 8601)
  → backend impersona al organizador → crea evento en su calendario
  → invita a todos los asistentes del tipo + al cliente
  → guarda ContactRequest con scheduled_at + calendar_event_id (solo demos)
  → admin ve la solicitud ya con cita agendada
  → (si es info) no aparece selector de horario
```

---

## Autenticación: Domain-Wide Delegation (DWD)

Se usa una **Service Account** de Google Cloud con DWD para impersonar usuarios `@grupocircula.com`
sin requerir flujo OAuth interactivo.

### Configuración (única vez, ya realizada)

1. Google Cloud Console → proyecto `circula-calendar`
2. Service Account: `circula-calendar-bot@circula-calendar.iam.gserviceaccount.com`
   - Clave JSON descargada y convertida a una línea
   - DWD habilitado en la pestaña "Details"
3. Google Workspace Admin (`admin.google.com`) → Security → API controls → Domain-Wide Delegation
   - Client ID: `102822071868230157977`
   - Scope autorizado: `https://www.googleapis.com/auth/calendar`

### Variable de entorno

```env
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"circula-calendar",...}
```

> El JSON va en **una sola línea**. Para convertirlo:
> ```bash
> python3 -c "import json; print(json.dumps(json.load(open('service-account.json'))))"
> ```
> **NUNCA subir el JSON ni el `.env` al repositorio.**

---

## Asignación de responsables por tipo

| Tipo | Organizador (crea el evento) | Asistentes adicionales |
|---|---|---|
| `demo_rep` | diana.erazo@grupocircula.com | david.salazar@grupocircula.com |
| `demo_indv` | diana.erazo@grupocircula.com | david.salazar@grupocircula.com |
| `demo_col` | diana.erazo@grupocircula.com | david.salazar@grupocircula.com |
| `demo_esg` | diana.erazo@grupocircula.com | david.salazar@grupocircula.com |
| `support` | lst@grupocircula.com | — |
| `info` | *(sin calendario)* | — |

- El **organizador** es el primer email de la lista — el evento se crea en su calendario.
- La disponibilidad se verifica contra **todos** los asistentes del tipo.
- `info` no tiene entrada en el mapa → `get_available_slots` retorna `[]` → el selector no se muestra en el frontend.

---

## Horarios disponibles

| Día | Horario |
|---|---|
| Lunes – Viernes | 8:00 AM – 5:00 PM (continuo, slots de 1h) |
| Sábado | 8:00 AM – 12:00 PM (slots de 1h) |
| Domingo | No disponible |

Los slots ya pasados (hora actual de Bogotá) se descartan automáticamente.
Timezone: `America/Bogota`.

---

## Archivos del sistema

### Backend

| Archivo | Responsabilidad |
|---|---|
| `backend/app/core/google_calendar.py` | Lógica principal: `get_available_slots()` y `create_event()` con DWD |
| `backend/app/core/config.py` | Setting `GOOGLE_SERVICE_ACCOUNT_JSON` |
| `backend/app/models/contact_request.py` | Campos `scheduled_at` y `calendar_event_id` en el modelo ORM |
| `backend/app/schemas/contact.py` | Schemas `AvailableSlot`, `ContactSlotsResponse`; campo `scheduled_at` en `ContactFormRequest` y `ContactRequestRead` |
| `backend/app/crud/contact_request.py` | `create_contact_request()` persiste `scheduled_at` y `calendar_event_id` |
| `backend/app/api/routes/contact.py` | Endpoint `GET /contact/slots` y creación de evento en `POST /contact/submit` |

### Frontend

| Archivo | Responsabilidad |
|---|---|
| `frontend/src/app/layouts/calendar/calendar.ts` | Componente modal de selección de fecha/slot; recibe `requirementType` como input |
| `frontend/src/app/layouts/calendar/calendar.html` | UI del modal |
| `frontend/src/app/features/landing/resources/resources.ts` | Integra el Calendar; maneja señales `showCalendar`, `selectedSlot`; limpia slot al cambiar tipo |
| `frontend/src/app/features/landing/resources/resources.html` | Botón "Elegir horario", label del slot seleccionado, componente `<app-calendar>` |

### Base de datos

Migración `aff273902683_add_scheduled_at_calendar_event_id_to_contact_requests.py`:
```sql
ALTER TABLE contact_requests ADD COLUMN scheduled_at TIMESTAMPTZ;
ALTER TABLE contact_requests ADD COLUMN calendar_event_id VARCHAR(255);
```

---

## API

### `GET /api/v1/contact/slots`

Retorna los slots disponibles para una fecha y tipo de requerimiento.

**Query params:**

| Param | Tipo | Ejemplo |
|---|---|---|
| `date` | `YYYY-MM-DD` | `2026-04-29` |
| `requirement_type` | string | `demo_rep` |

**Respuesta exitosa `200`:**
```json
{
  "slots": [
    { "datetime_iso": "2026-04-29T08:00:00-05:00", "label": "8:00 AM" },
    { "datetime_iso": "2026-04-29T09:00:00-05:00", "label": "9:00 AM" }
  ]
}
```

**Comportamiento ante errores de Google Calendar:** retorna `{ "slots": [] }` sin romper el formulario. El error queda registrado como `WARNING` en el log del backend.

---

### `POST /api/v1/contact/submit`

Cambios respecto a la versión anterior:

- Si `scheduled_at` viene en el body → crea evento en Google Calendar (best-effort: si falla, el form igual se envía y `calendar_event_id` queda `null`).
- Solo persiste en DB las solicitudes de tipo **demo** (`demo_rep`, `demo_indv`, `demo_col`, `demo_esg`).
- `support` e `info` solo envían correo, no se guardan.
- El chequeo de email duplicado aplica a todos los tipos.

**Body con horario:**
```json
{
  "name": "Juan Pérez",
  "company": "Empresa SA",
  "requirement_type": "demo_rep",
  "phone": "3001234567",
  "email": "juan@empresa.com",
  "message": "Me interesa el demo REP",
  "scheduled_at": "2026-04-29T09:00:00-05:00"
}
```

---

## Comportamiento por tipo en el frontend

| Tipo | ¿Muestra selector de horario? | ¿Se persiste en DB? |
|---|---|---|
| `demo_*` | Sí | Sí |
| `support` | Sí | No |
| `info` | **No** | No |

El selector de horario se oculta dinámicamente con `*ngIf` cuando el tipo es `info`.
Al cambiar de tipo, el slot seleccionado se limpia automáticamente (`ngOnInit` + `valueChanges`).

---

## Dependencias instaladas

```toml
# backend/pyproject.toml
"google-auth>=2.29.0"
"google-api-python-client>=2.126.0"
```

---

## Verificación del sistema

1. **Endpoint de slots:**
   ```
   GET /api/v1/contact/slots?date=2026-04-29&requirement_type=demo_rep
   ```
   Debe retornar slots donde diana y david están libres.

2. **Submit con slot:**
   Enviar el formulario con `scheduled_at` → en el calendario de `diana.erazo@grupocircula.com` aparece el evento con todos los invitados y el email del cliente.

3. **DB:**
   ```sql
   SELECT name, requirement_type, scheduled_at, calendar_event_id
   FROM contact_requests ORDER BY id DESC LIMIT 1;
   ```
   `scheduled_at` y `calendar_event_id` con valor para demos.

4. **Sin slot:** Enviar sin elegir horario → `scheduled_at` y `calendar_event_id` son `NULL`, sin llamada a Google Calendar.

5. **Fallo de DWD:** Si las credenciales fallan, el formulario igual se envía. En logs aparece `WARNING: Error consultando disponibilidad Google Calendar: ...`.
