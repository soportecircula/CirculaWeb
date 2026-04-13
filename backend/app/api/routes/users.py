import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select

from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)
from app.core.config import settings
from app.core.security import get_password_hash, verify_password
from app.crud import user as crud_user
from app.models.user import User
from app.core.messages import (
    INSUFFICIENT_PRIVILEGES,
    CANNOT_DELETE_ACTIVE_USER,
    INCORRECT_PASSWORD,
    PASSWORD_UPDATED,
    SAME_PASSWORD,
    SUPERUSER_NO_DELETE_SELF,
    USER_DELETED,
    USER_EMAIL_EXISTS,
    USER_NOT_FOUND,
    USER_WITH_EMAIL_EXISTS,
    USER_WITH_ID_NOT_EXISTS,
)
from app.schemas.common import Message
from app.schemas.user import (
    UpdatePassword,
    UserCreate,
    UserMeResponse,
    UserPublic,
    UserRegister,
    UsersPublic,
    UserUpdate,
    UserUpdateMe,
)
from app.utils import generate_new_account_email, send_email

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UsersPublic,
)
def read_users(
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
) -> UsersPublic:
    count = session.scalar(select(func.count()).select_from(User))
    users = session.scalars(
        select(User).order_by(User.created_at.desc()).offset(skip).limit(limit)
    ).all()
    return UsersPublic(data=users, count=count or 0)  # type: ignore[arg-type]


@router.post(
    "/", dependencies=[Depends(get_current_active_superuser)], response_model=UserPublic
)
def create_user(*, session: SessionDep, user_in: UserCreate) -> UserPublic:
    user = crud_user.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail=USER_WITH_EMAIL_EXISTS,
        )
    user = crud_user.create_user(session=session, user_create=user_in)
    if settings.emails_enabled and user_in.email:
        email_data = generate_new_account_email(
            email_to=user_in.email, username=user_in.email, password=user_in.password
        )
        send_email(
            email_to=user_in.email,
            subject=email_data.subject,
            html_content=email_data.html_content,
        )
    return user


@router.patch("/me", response_model=UserPublic)
def update_user_me(
    *, session: SessionDep, user_in: UserUpdateMe, current_user: CurrentUser
) -> UserPublic:
    if user_in.email:
        existing_user = crud_user.get_user_by_email(
            session=session, email=user_in.email
        )
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=409, detail=USER_EMAIL_EXISTS
            )
    user_data = user_in.model_dump(exclude_unset=True)
    for field, value in user_data.items():
        setattr(current_user, field, value)
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user


@router.patch("/me/password", response_model=Message)
def update_password_me(
    *, session: SessionDep, body: UpdatePassword, current_user: CurrentUser
) -> Message:
    verified, _ = verify_password(body.current_password, current_user.hashed_password)
    if not verified:
        raise HTTPException(status_code=400, detail=INCORRECT_PASSWORD)
    if body.current_password == body.new_password:
        raise HTTPException(
            status_code=400, detail=SAME_PASSWORD
        )
    current_user.hashed_password = get_password_hash(body.new_password)
    session.add(current_user)
    session.commit()
    return Message(message=PASSWORD_UPDATED)


@router.get("/me", response_model=UserMeResponse)
def read_user_me(current_user: CurrentUser) -> UserMeResponse:
    return UserMeResponse.model_validate(current_user)


@router.delete("/me", response_model=Message)
def delete_user_me(session: SessionDep, current_user: CurrentUser) -> Message:
    if current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail=SUPERUSER_NO_DELETE_SELF
        )
    session.delete(current_user)
    session.commit()
    return Message(message="User deleted successfully")


@router.post("/signup", response_model=UserPublic)
def register_user(session: SessionDep, user_in: UserRegister) -> UserPublic:
    user = crud_user.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail=USER_WITH_EMAIL_EXISTS,
        )
    user_create = UserCreate.model_validate(user_in.model_dump())
    user = crud_user.create_user(session=session, user_create=user_create)
    return user


@router.get("/{user_id}", response_model=UserPublic)
def read_user_by_id(
    user_id: uuid.UUID, session: SessionDep, current_user: CurrentUser
) -> UserPublic:
    user = session.get(User, user_id)
    if user == current_user:
        return user
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403,
            detail=INSUFFICIENT_PRIVILEGES,
        )
    if user is None:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND)
    return user


@router.patch(
    "/{user_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UserPublic,
)
def update_user(
    *,
    session: SessionDep,
    user_id: uuid.UUID,
    user_in: UserUpdate,
) -> UserPublic:
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail=USER_WITH_ID_NOT_EXISTS,
        )
    if user_in.email:
        existing_user = crud_user.get_user_by_email(
            session=session, email=user_in.email
        )
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=409, detail=USER_EMAIL_EXISTS
            )
    db_user = crud_user.update_user(session=session, db_user=db_user, user_in=user_in)
    return db_user


@router.delete("/{user_id}", dependencies=[Depends(get_current_active_superuser)])
def delete_user(
    session: SessionDep, current_user: CurrentUser, user_id: uuid.UUID
) -> Message:
    """Delete only inactive users."""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND)
    if user == current_user:
        raise HTTPException(
            status_code=403, detail=SUPERUSER_NO_DELETE_SELF
        )
    if user.is_active:
        raise HTTPException(
            status_code=409,
            detail=CANNOT_DELETE_ACTIVE_USER,
        )
    session.delete(user)
    session.commit()
    return Message(message=USER_DELETED)
