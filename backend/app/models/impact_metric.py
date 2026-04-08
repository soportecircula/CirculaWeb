from __future__ import annotations
from sqlalchemy import String, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
from app.models.base import TimestampMixin


class ImpactMetric(TimestampMixin, Base):
    __tablename__ = "impact_metrics"
    
    # Usamos ID autoincremental para simplicidad o UUID como en User
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    key_name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    label: Mapped[str] = mapped_column(String(100))
    value: Mapped[float] = mapped_column(Float, default=0.0)
    unit: Mapped[str | None] = mapped_column(String(20), default=None)
    icon: Mapped[str | None] = mapped_column(String(50), default=None)