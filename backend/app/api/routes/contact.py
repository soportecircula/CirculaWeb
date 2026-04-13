import logging

from fastapi import APIRouter, HTTPException, Request

from app.core.config import settings
from app.core.rate_limit import limiter
from app.schemas.common import Message
from app.schemas.contact import ContactFormRequest
from app.utils import generate_contact_form_email, send_email

router = APIRouter(prefix="/contact", tags=["contact"])

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
) -> Message:
    if not settings.emails_enabled:
        raise HTTPException(status_code=503, detail="Servicio de correo no disponible.")

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
        raise HTTPException(
            status_code=502,
            detail=f"Error al enviar el correo: {exc}",
        ) from exc

    return Message(message="Mensaje enviado correctamente.")
