from datetime import timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import CurrentUser, SessionDep, get_current_active_superuser
from app.api.routes.auth import _set_refresh_cookie
from app.core import login_limiter, security
from app.core.config import settings
from app.core.rate_limit import limiter
from app.crud import user as crud_user
from app.schemas.common import Message
from app.schemas.token import NewPassword, Token
from app.schemas.user import UserPublic, UserUpdate
from app.core.messages import (
    ACCOUNT_LOCKED,
    INCORRECT_EMAIL_OR_PASSWORD,
    INACTIVE_USER,
    INVALID_TOKEN,
    PASSWORD_RESET_SENT,
    PASSWORD_UPDATED,
    USER_NOT_REGISTERED,
)
from app.utils import (
    generate_password_reset_token,
    generate_reset_password_email,
    send_email,
    verify_password_reset_token,
)

router = APIRouter(tags=["login"])


@router.post("/login/access-token")
@limiter.limit("5/minute")
def login_access_token(
    request: Request,
    session: SessionDep,
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    remember_me: bool = Query(False),
) -> Token:
    email = form_data.username

    if not crud_user.get_user_by_email(session=session, email=email):
        raise HTTPException(status_code=404, detail=USER_NOT_REGISTERED)

    if login_limiter.is_blocked(email):
        raise HTTPException(
            status_code=429,
            detail=ACCOUNT_LOCKED.format(minutes=settings.LOGIN_BLOCK_MINUTES),
        )

    user = crud_user.authenticate(
        session=session, email=email, password=form_data.password
    )
    if not user:
        count = login_limiter.increment_fail(email)
        remaining = max(0, settings.LOGIN_MAX_ATTEMPTS - count)
        if remaining == 0:
            raise HTTPException(
                status_code=429,
                detail=ACCOUNT_LOCKED.format(minutes=settings.LOGIN_BLOCK_MINUTES),
            )
        raise HTTPException(
            status_code=400,
            detail=f"{INCORRECT_EMAIL_OR_PASSWORD}. Intentos restantes: {remaining}",
        )
    elif not user.is_active:
        raise HTTPException(status_code=403, detail=INACTIVE_USER)

    login_limiter.reset_fails(email)

    access_token = security.create_access_token(
        user.id, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = security.create_refresh_token(
        user.id, timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    )

    _set_refresh_cookie(response, refresh_token, persistent=remember_me)
    return Token(access_token=access_token)


@router.post("/login/test-token", response_model=UserPublic)
def test_token(current_user: CurrentUser) -> Any:
    return current_user


@router.post("/password-recovery/{email}")
@limiter.limit("3/minute")
def recover_password(request: Request, email: str, session: SessionDep) -> Message:
    user = crud_user.get_user_by_email(session=session, email=email)
    if user:
        password_reset_token = generate_password_reset_token(email=email)
        email_data = generate_reset_password_email(
            email_to=user.email, email=email, token=password_reset_token
        )
        send_email(
            email_to=user.email,
            subject=email_data.subject,
            html_content=email_data.html_content,
        )
    return Message(message=PASSWORD_RESET_SENT)


@router.post("/reset-password/")
def reset_password(session: SessionDep, body: NewPassword) -> Message:
    email = verify_password_reset_token(token=body.token)
    if not email:
        raise HTTPException(status_code=400, detail=INVALID_TOKEN)
    user = crud_user.get_user_by_email(session=session, email=email)
    if not user:
        raise HTTPException(status_code=400, detail=INVALID_TOKEN)
    elif not user.is_active:
        raise HTTPException(status_code=403, detail=INACTIVE_USER)
    user_in_update = UserUpdate(password=body.new_password)
    crud_user.update_user(session=session, db_user=user, user_in=user_in_update)
    return Message(message=PASSWORD_UPDATED)


@router.post(
    "/password-recovery-html-content/{email}",
    dependencies=[Depends(get_current_active_superuser)],
    response_class=HTMLResponse,
)
def recover_password_html_content(email: str, session: SessionDep) -> Any:
    user = crud_user.get_user_by_email(session=session, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="El usuario con este correo no existe en el sistema.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    email_data = generate_reset_password_email(
        email_to=user.email, email=email, token=password_reset_token
    )
    return HTMLResponse(
        content=email_data.html_content, headers={"subject:": email_data.subject}
    )
