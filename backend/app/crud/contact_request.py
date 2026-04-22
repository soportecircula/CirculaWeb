from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.contact_request import ContactRequest, ContactStatus
from app.schemas.contact import ContactFormRequest


def create_contact_request(
    *, session: Session, form_data: ContactFormRequest, calendar_event_id: str | None = None
) -> ContactRequest:
    scheduled_at: datetime | None = None
    if form_data.scheduled_at:
        scheduled_at = datetime.fromisoformat(form_data.scheduled_at)

    db_obj = ContactRequest(
        name=form_data.name,
        company=form_data.company,
        requirement_type=form_data.requirement_type,
        phone=form_data.phone,
        email=form_data.email,
        message=form_data.message,
        status=ContactStatus.PENDING,
        scheduled_at=scheduled_at,
        calendar_event_id=calendar_event_id,
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_contact_request(*, session: Session, request_id: int) -> ContactRequest | None:
    return session.get(ContactRequest, request_id)


def get_active_request_by_email(
    *, session: Session, email: str
) -> ContactRequest | None:
    stmt = (
        select(ContactRequest)
        .where(
            ContactRequest.email == email,
            ContactRequest.status.in_([ContactStatus.PENDING, ContactStatus.APPROVED]),
        )
        .limit(1)
    )
    return session.scalars(stmt).first()


def list_contact_requests(
    *,
    session: Session,
    status: ContactStatus | None = None,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[ContactRequest], int]:
    stmt = select(ContactRequest)
    count_stmt = select(func.count()).select_from(ContactRequest)

    if status is not None:
        stmt = stmt.where(ContactRequest.status == status)
        count_stmt = count_stmt.where(ContactRequest.status == status)

    stmt = stmt.order_by(ContactRequest.created_at.desc()).offset(skip).limit(limit)

    items = list(session.scalars(stmt).all())
    total = session.scalar(count_stmt) or 0
    return items, total


def approve_contact_request(
    *, session: Session, db_request: ContactRequest, reviewed_by_id: uuid.UUID
) -> ContactRequest:
    db_request.status = ContactStatus.APPROVED
    db_request.reviewed_by_id = reviewed_by_id
    db_request.reviewed_at = datetime.now(timezone.utc)
    session.add(db_request)
    session.commit()
    session.refresh(db_request)
    return db_request


def reject_contact_request(
    *,
    session: Session,
    db_request: ContactRequest,
    reviewed_by_id: uuid.UUID,
    note: str | None,
) -> ContactRequest:
    db_request.status = ContactStatus.REJECTED
    db_request.reviewed_by_id = reviewed_by_id
    db_request.reviewed_at = datetime.now(timezone.utc)
    db_request.rejection_note = note
    session.add(db_request)
    session.commit()
    session.refresh(db_request)
    return db_request
