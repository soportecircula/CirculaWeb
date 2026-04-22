from __future__ import annotations

import logging
from datetime import date as Date, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request

from app.api.deps import SessionDep, get_current_active_superuser
from app.core.config import settings
from app.core.google_calendar import create_event, get_available_slots
from app.core.messages import CONTACT_ALREADY_REVIEWED, CONTACT_REQUEST_NOT_FOUND, CONTACT_DUPLICATE_REQUEST
from app.core.rate_limit import limiter
from app.crud.contact_request import (
    approve_contact_request,
    create_contact_request,
    get_active_request_by_email,
    get_contact_request,
    list_contact_requests,
    reject_contact_request,
)
from app.models.contact_request import ContactStatus
from app.models.user import User
from app.schemas.common import Message
from app.schemas.contact import (
    AvailableSlot,
    ContactFormRequest,
    ContactRequestListResponse,
    ContactRequestRead,
    ContactSlotsResponse,
    RejectPayload,
)
from app.utils import generate_contact_form_email, send_email

router = APIRouter(prefix="/contact", tags=["contact"])
SuperuserDep = Annotated[User, Depends(get_current_active_superuser)]

_DEMO_TYPES = {"demo_rep", "demo_indv", "demo_col", "demo_esg"}
_RECIPIENT_MAP: dict[str, list[str]] = {
    "support": ["lst@grupocircula.com"],
    "info": ["contacto@grupocircula.com"],
}
_DEMO_RECIPIENTS = ["diana.erazo@grupocircula.com", "david.salazar@grupocircula.com"]


@router.get("/slots", response_model=ContactSlotsResponse)
def get_slots(
    date: str = Query(...),
    requirement_type: str = Query(...),
) -> ContactSlotsResponse:
    try:
        target = Date.fromisoformat(date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de fecha inválido. Usa YYYY-MM-DD.")
    try:
        datetimes = get_available_slots(target, requirement_type)
    except Exception as exc:
        logging.warning("Error consultando disponibilidad Google Calendar: %s", exc)
        return ContactSlotsResponse(slots=[])

    def _label(dt: datetime) -> str:
        h = dt.hour % 12 or 12
        return f"{h}:00 {'AM' if dt.hour < 12 else 'PM'}"

    return ContactSlotsResponse(
        slots=[AvailableSlot(datetime_iso=dt.isoformat(), label=_label(dt)) for dt in datetimes]
    )


@router.post("/submit", status_code=200)
@limiter.limit("5/minute")
async def submit_contact_form(
    request: Request,
    form_data: ContactFormRequest,
    session: SessionDep,
) -> Message:
    # 1. Verificar si ya existe una solicitud activa con este correo
    existing = get_active_request_by_email(session=session, email=form_data.email)
    if existing:
        raise HTTPException(
            status_code=409,
            detail=CONTACT_DUPLICATE_REQUEST,
        )

    # 2. Crear evento en Google Calendar si el usuario eligió horario
    calendar_event_id: str | None = None
    if form_data.scheduled_at:
        try:
            calendar_event_id = create_event(
                title=f"Cita Circula — {form_data.name} ({form_data.company})",
                description=form_data.message or f"Tipo: {form_data.requirement_type}",
                scheduled_at=datetime.fromisoformat(form_data.scheduled_at),
                requirement_type=form_data.requirement_type,
                attendee_email=form_data.email,
            )
        except Exception as exc:
            logging.warning("No se pudo crear evento Google Calendar: %s", exc)

    # 3. Persistir solo solicitudes de demo
    if form_data.requirement_type in _DEMO_TYPES:
        create_contact_request(session=session, form_data=form_data, calendar_event_id=calendar_event_id)
    
    # 3. Solo enviar correo si está habilitado
    if not settings.emails_enabled:
        return Message(message="Mensaje enviado correctamente.")

    recipients = (
        _DEMO_RECIPIENTS
        if form_data.requirement_type in _DEMO_TYPES
        else _RECIPIENT_MAP.get(form_data.requirement_type, [])
    )

    email_data = generate_contact_form_email(form_data=form_data)
    try:
        for recipient in recipients:
            send_email(
                email_to=recipient,
                subject=email_data.subject,
                html_content=email_data.html_content,
            )
    except Exception as exc:
        logging.warning("Error al enviar correo de contacto: %s", exc)

    return Message(message="Mensaje enviado correctamente.")

@router.get("/requests", response_model=ContactRequestListResponse)
def list_request(
    session: SessionDep,
    _: SuperuserDep,
    status: ContactStatus | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, le=100),
)-> ContactRequestListResponse:
    items, total = list_contact_requests(
        session=session, status=status, skip=skip, limit=limit
    )
    return ContactRequestListResponse(items=items, total=total)

@router.post("/requests/{request_id}/approve", response_model=ContactRequestRead)
def approve_request(
    request_id: int,
    session: SessionDep,
    current_user: SuperuserDep
)-> ContactRequestRead:
    db_request = get_contact_request(session=session, request_id=request_id)
    if not db_request:
        raise HTTPException(status_code=404, detail=CONTACT_REQUEST_NOT_FOUND)
    if db_request.status != ContactStatus.PENDING:
        raise HTTPException(status_code=400, detail=CONTACT_ALREADY_REVIEWED)
    
    update = approve_contact_request(
        session=session,
        db_request=db_request,
        reviewed_by_id=current_user.id
    )
    return update

@router.post("/requests/{request_id}/reject", response_model=ContactRequestRead)
def reject_request(
    request_id: int,
    session: SessionDep,
    current_user: SuperuserDep,
    payload: RejectPayload,
) -> ContactRequestRead:
    db_request = get_contact_request(session=session, request_id=request_id)
    if not db_request:
        raise HTTPException(status_code=404, detail=CONTACT_REQUEST_NOT_FOUND)
    if db_request.status != ContactStatus.PENDING:
        raise HTTPException(status_code=400, detail=CONTACT_ALREADY_REVIEWED)
    
    update = reject_contact_request(
        session=session,
        db_request=db_request,
        reviewed_by_id=current_user.id,
        note=payload.note
    )
    return update