from __future__ import annotations

import uuid
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)

from app.models.producer import CuentaConPlan, EstadoProductor, TipoProductor

# ── Sector ──────────────────────────────────────────────────────────────────


class SectorRead(BaseModel):
    id: UUID
    nombre: str
    es_predefinido: bool
    model_config = ConfigDict(from_attributes=True)


class SectorCreate(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)


# ── ObligacionNormativa ───────────────────────────────────────────────────────


class NormativeObligationRead(BaseModel):
    id: UUID
    name: str
    is_predefined: bool
    model_config = ConfigDict(from_attributes=True)


# ── Producer ─────────────────────────────────────────────────────────────────


class ProducerRead(BaseModel):
    id: UUID
    owner_id: UUID
    sector_id: UUID | None = None
    other_sector: str | None = None
    razon_social: str
    nit: str
    ciudad: str | None = None
    departamento: str | None = None
    direccion: str | None = None
    correo: EmailStr | None = None
    contacto: str | None = None
    nombre_responsable: str | None = None
    tipo: TipoProductor | None = None
    cuenta_con_plan: CuentaConPlan | None = None
    en_incumplimiento_rep: bool
    obligaciones_normativas: list[NormativeObligationRead] = []
    estado: EstadoProductor
    model_config = ConfigDict(from_attributes=True)


class ProducerUpsert(BaseModel):
    """Body for PUT /rep/producers/me — creates or updates the own producer."""

    sector_id: UUID | None = Field(
        default=None,
        description=(
            "UUID del sector (campo `id` de GET /api/v1/rep/sectors). "
            "En JSON debe ir entre comillas como string, no como número."
        ),
        examples=["550e8400-e29b-41d4-a716-446655440000"],
    )

    other_sector: str | None = Field(default=None, max_length=100)

    @model_validator(mode="after")
    def mutual_exclusion(self) -> ProducerUpsert:
        if self.other_sector and self.sector_id:
            self.sector_id = None
        return self

    @field_validator("sector_id", mode="before")
    @classmethod
    def sector_id_no_numeros(cls, v: object) -> object:
        if v is None:
            return None
        if isinstance(v, bool):
            raise ValueError(
                "sector_id debe ser un UUID en string o null (no un booleano)."
            )
        if isinstance(v, int | float):
            raise ValueError(
                "sector_id debe ser el UUID del sector como string JSON, no un número. "
                "Lista los sectores con GET /api/v1/rep/sectors y copia el campo id."
            )
        return v

    razon_social: str = Field(min_length=2, max_length=200)
    nit: str = Field(min_length=3, max_length=30)
    ciudad: str | None = Field(default=None, max_length=100)
    departamento: str | None = Field(default=None, max_length=100)
    direccion: str | None = Field(default=None, max_length=255)
    correo: EmailStr | None = Field(default=None, max_length=255)
    contacto: str | None = Field(default=None, max_length=30)

    @field_validator("contacto")
    @classmethod
    def contacto_solo_numeros(cls, v: str | None) -> str | None:
        if v is not None and not v.isdigit():
            raise ValueError("El celular debe contener solo números.")
        return v
    nombre_responsable: str | None = Field(default=None, max_length=200)
    tipo: TipoProductor | None = None
    cuenta_con_plan: CuentaConPlan | None = None
    en_incumplimiento_rep: bool
    obligation_ids: list[uuid.UUID]


class ProducerAdminUpdate(ProducerUpsert):
    """Body for PATCH /rep/admin/producers/{id} — includes status change."""

    estado: EstadoProductor = EstadoProductor.activo
