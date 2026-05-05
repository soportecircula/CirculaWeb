from __future__ import annotations

import uuid

from sqlalchemy import Boolean, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.base import TimestampMixin


class Sector(TimestampMixin, Base):
    __tablename__ = "sectors"
    __table_args__ = (UniqueConstraint("nombre", name="uq_sectors_nombre"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    es_predefinido: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
