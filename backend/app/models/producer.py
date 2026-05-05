from __future__ import annotations

import enum
import uuid

from sqlalchemy import (
    JSON,
    Boolean,
    ForeignKey,
    String,
    UniqueConstraint,  # kept for nit constraint
)
from sqlalchemy import (
    Enum as SAEnum,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.base import TimestampMixin


class TipoProductor(str, enum.Enum):
    fabricante = "fabricante"
    importador = "importador"


class CuentaConPlan(str, enum.Enum):
    individual = "individual"
    colectivo = "colectivo"
    no = "no"


class EstadoProductor(str, enum.Enum):
    activo = "activo"
    inactivo = "inactivo"


class Producer(TimestampMixin, Base):
    __tablename__ = "producers"
    __table_args__ = (UniqueConstraint("nit", name="uq_producers_nit"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)

    # Relaciones
    owner_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    sector_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("sectors.id", ondelete="SET NULL"), nullable=True, default=None
    )

    # Información empresa
    razon_social: Mapped[str] = mapped_column(String(200), nullable=False)
    nit: Mapped[str] = mapped_column(String(30), nullable=False)
    ciudad: Mapped[str | None] = mapped_column(String(100), nullable=True, default=None)
    departamento: Mapped[str | None] = mapped_column(
        String(100), nullable=True, default=None
    )
    direccion: Mapped[str | None] = mapped_column(
        String(255), nullable=True, default=None
    )
    correo: Mapped[str | None] = mapped_column(String(255), nullable=True, default=None)
    contacto: Mapped[str | None] = mapped_column(
        String(30), nullable=True, default=None
    )
    nombre_responsable: Mapped[str | None] = mapped_column(
        String(200), nullable=True, default=None
    )

    # Clasificación REP
    tipo: Mapped[TipoProductor | None] = mapped_column(
        SAEnum(TipoProductor), nullable=True, default=None
    )
    cuenta_con_plan: Mapped[CuentaConPlan | None] = mapped_column(
        SAEnum(CuentaConPlan), nullable=True, default=None
    )
    en_incumplimiento_rep: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    obligaciones_normativas: Mapped[list[str] | None] = mapped_column(
        JSON, nullable=True, default=None
    )

    # Estado
    estado: Mapped[EstadoProductor] = mapped_column(
        SAEnum(EstadoProductor), default=EstadoProductor.activo, nullable=False
    )
