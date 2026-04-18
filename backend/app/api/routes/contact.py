from __future__ import annotations

import logging
from typing import Annotated

from fastapi import APIRouter, HTTPException, Request, Depends, Query

from app.api.deps import SessionDep, get_current_active_superuser
from app.core.config import settings
from app.core.messages import CONTACT_ALREADY_REVIEWED, CONTACT_REQUEST_NOT_FOUND   
from app.core.rate_limit import limiter
from app.crud.contact_request import (
    approve_contact_request,
    create_contact_request,
    get_contact_request,
    list_contact_requests,
    reject_contact_request,
)
from app.models.contact_request import ContactStatus
from app.models.user import User
from app.schemas.common import Message
from app.schemas.contact import (
    ContactFormRequest,
    ContactRequestListResponse,
    ContactRequestRead,
    RejectPayload,
)
from app.utils import generate_contact_form_email, send_email  

router = APIRouter(prefix="/contact", tags=["contact"])
SuperuserDep = Annotated[User, Depends(get_current_active_superuser)]

_DEMO_TYPES = {"demo_rep", "demo_indv", "demo_col", "demo_esg"}
_RECIPIENT_MAP: dict[str, list[str]] = {
    "support": ["soporte.circula@gmail.com"],
    "info": ["contacto@grupocircula.com"],
}
_DEMO_RECIPIENTS = ["diana.erazo@grupocircula.com", "david.salazar@grupocircula.com"]


@router.post("/submit", status_code=200)
@limiter.limit("5/minute")
async def submit_contact_form(
    request: Request,
    form_data: ContactFormRequest,
    session: SessionDep,
) -> Message:
    # 1. Persistir siempre, independiente del correo
    create_contact_request(session=session, form_data=form_data)
    
    # 2. Solo enviar correo si está habilitado
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