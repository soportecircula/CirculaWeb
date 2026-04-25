import uuid

from pydantic import BaseModel, EmailStr, Field
from app.models.user import PlanType

class UserCreate(BaseModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=1, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=50)
    plan_type: PlanType | None = None
    company: str | None = Field(default=None, max_length=50)
    nit: str | None = Field(default=None, max_length=30)
    phone: str | None = Field(default=None, max_length=20)


class UserRegister(BaseModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=1, max_length=255)
    full_name: str | None = Field(default=None, max_length=50)


class UserUpdate(BaseModel):
    email: EmailStr | None = Field(default=None, max_length=255)
    password: str | None = Field(default=None, min_length=1, max_length=255)
    full_name: str | None = Field(default=None, max_length=50)
    avatar_url: str | None = Field(default=None, max_length=500)
    is_active: bool | None = None
    is_superuser: bool | None = None


class UserUpdateMe(BaseModel):
    full_name: str | None = Field(default=None, max_length=50)
    email: EmailStr | None = Field(default=None, max_length=255)
    avatar_url: str | None = Field(default=None, max_length=500)


class UpdatePassword(BaseModel):
    current_password: str = Field(min_length=1, max_length=255)
    new_password: str = Field(min_length=1, max_length=255)


class UserPublic(BaseModel):
    id: uuid.UUID
    email: EmailStr
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = None
    avatar_url: str | None = None
    plan_type: PlanType | None = None
    company: str | None = None
    nit: str | None = None
    phone: str | None = None

    model_config = {"from_attributes": True}


class UsersPublic(BaseModel):
    data: list[UserPublic]
    count: int


class UserMeResponse(UserPublic):
    """Respuesta extendida del usuario autenticado."""
    pass

class UserRegisterWithInvite(BaseModel):
    invite_token: str
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=255)
    full_name: str = Field(min_length=1, max_length=50)
    company: str = Field(min_length=2, max_length=100)
    nit: str = Field(min_length=5, max_length=30)
    phone: str = Field(min_length=7, max_length=20)
    
class InviteTokenInfo(BaseModel):
    email: str
    plan_type: PlanType
    plan_label: str
    company: str
    name: str
