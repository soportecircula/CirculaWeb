from datetime import timedelta

import jwt
from fastapi import APIRouter, HTTPException, Request, Response, status
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError

from app.api.deps import SessionDep
from app.core import security
from app.core.config import settings
from app.core.rate_limit import limiter
from app.models.user import User
from app.core.messages import (
    INVALID_REFRESH_TOKEN,
    INVALID_TOKEN_TYPE,
    LOGGED_OUT,
    REFRESH_TOKEN_MISSING,
    USER_NOT_FOUND_OR_INACTIVE,
)
from app.schemas.common import Message
from app.schemas.token import Token, TokenPayload

router = APIRouter(tags=["auth"])

REFRESH_COOKIE_KEY = "refresh_token"


def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        key=REFRESH_COOKIE_KEY,
        value=refresh_token,
        httponly=True,
        secure=settings.ENVIRONMENT != "local",
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        path=f"{settings.API_V1_STR}/auth",
    )


@router.post("/auth/refresh")
@limiter.limit("10/minute")
def refresh_token(request: Request, response: Response, session: SessionDep) -> Token:
    raw_token = request.cookies.get(REFRESH_COOKIE_KEY)
    if not raw_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=REFRESH_TOKEN_MISSING,
        )

    try:
        payload = jwt.decode(
            raw_token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_REFRESH_TOKEN,
        )

    if token_data.type != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_TOKEN_TYPE,
        )

    user = session.get(User, token_data.sub)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=USER_NOT_FOUND_OR_INACTIVE,
        )

    access_token = security.create_access_token(
        user.id, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    new_refresh_token = security.create_refresh_token(
        user.id, timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    )

    _set_refresh_cookie(response, new_refresh_token)
    return Token(access_token=access_token)


@router.post("/auth/logout")
def logout(response: Response) -> Message:
    response.delete_cookie(
        key=REFRESH_COOKIE_KEY,
        path=f"{settings.API_V1_STR}/auth",
    )
    return Message(message=LOGGED_OUT)
