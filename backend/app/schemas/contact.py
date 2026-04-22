from __future__ import annotations

import uuid
from datetime import datetime
from app.models.contact_request import ContactStatus
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, ConfigDict

RequirementType = Literal["demo_rep", "demo_indv", "demo_col", "demo_esg", "support", "info"]


class AvailableSlot(BaseModel):
    datetime_iso: str
    label: str


class ContactSlotsResponse(BaseModel):
    slots: list[AvailableSlot]


class ContactFormRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    company: str = Field(min_length=2, max_length=100)
    requirement_type: RequirementType
    phone: str = Field(pattern=r"^\d{7,15}$")
    email: EmailStr
    message: str | None = Field(default=None, max_length=500)
    scheduled_at: str | None = Field(default=None)

class ContactRequestRead(BaseModel):
    id: int
    name: str = Field(min_length=2, max_length=100)
    company: str = Field(min_length=2, max_length=100)
    requirement_type: str
    phone: str = Field(pattern=r"^\d{7,15}$")
    email: str
    message: str | None = Field(default=None, max_length=500)
    status: ContactStatus
    rejection_note: str | None = Field(default=None, max_length=300)
    reviewed_by_id: uuid.UUID | None = Field(default=None)
    reviewed_at: datetime | None = Field(default=None)
    scheduled_at: datetime | None = Field(default=None)
    calendar_event_id: str | None = Field(default=None)
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
    
class ContactRequestListResponse(BaseModel):
    items: list[ContactRequestRead]
    total: int
    
class RejectPayload(BaseModel):
    note: str | None = Field(default=None, max_length=300)