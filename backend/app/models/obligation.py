from __future__ import annotations

import uuid

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.base import TimestampMixin


class NormativeObligation(TimestampMixin, Base):
    __tablename__ = "normative_obligations"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    is_predefined: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
