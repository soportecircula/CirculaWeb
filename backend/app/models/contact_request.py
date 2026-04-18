from __future__ import annotations

from datetime import datetime
import enum
import uuid
from sqlalchemy import String, Enum as SAEnum, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import TimestampMixin
from app.db.base import Base

class ContactStatus(str, enum.Enum):
    PENDING="PENDING"
    APPROVED="APPROVED"
    REJECTED="REJECTED"
    
class ContactRequest(Base, TimestampMixin):
    __tablename__ = "contact_requests"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    company: Mapped[str] = mapped_column(String(100), nullable=False)
    requirement_type: Mapped[str] = mapped_column(String(50), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[ContactStatus] = mapped_column(SAEnum(ContactStatus), nullable=False, default=ContactStatus.PENDING)
    rejection_note: Mapped[str | None] = mapped_column(String(300), nullable=True)
    reviewed_by_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True, default=None)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, default=None) 