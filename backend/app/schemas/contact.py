from typing import Literal

from pydantic import BaseModel, EmailStr, Field

RequirementType = Literal["demo_rep", "demo_indv", "demo_col", "demo_esg", "support", "info"]


class ContactFormRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    company: str = Field(min_length=2, max_length=100)
    requirement_type: RequirementType
    phone: str = Field(pattern=r"^\d{7,15}$")
    email: EmailStr
    message: str | None = Field(default=None, max_length=500)
