"""Contador de intentos de login fallidos por email usando Redis síncrono."""
from __future__ import annotations

import logging

import redis as sync_redis

from app.core.config import settings

logger = logging.getLogger(__name__)

_client: sync_redis.Redis | None = None  # type: ignore[type-arg]


def _redis() -> sync_redis.Redis:  # type: ignore[type-arg]
    global _client
    if _client is None:
        _client = sync_redis.Redis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=2,
            socket_timeout=2,
        )
    return _client


def _fail_key(email: str) -> str:
    return f"circula:{settings.ENVIRONMENT}:login_fails:{email.lower()}"


def _block_key(email: str) -> str:
    return f"circula:{settings.ENVIRONMENT}:login_block:{email.lower()}"


def is_blocked(email: str) -> bool:
    """Retorna True si la cuenta está bloqueada."""
    try:
        return _redis().exists(_block_key(email)) == 1
    except Exception as exc:
        logger.warning("login_limiter.is_blocked error: %s", exc)
        return False  # fail open — no bloquear si Redis no responde


def increment_fail(email: str) -> int:
    """Incrementa el contador y bloquea si se alcanza el límite. Retorna el conteo actual."""
    try:
        r = _redis()
        fail_key = _fail_key(email)
        count = r.incr(fail_key)
        block_ttl = settings.LOGIN_BLOCK_MINUTES * 60
        r.expire(fail_key, block_ttl)
        if count >= settings.LOGIN_MAX_ATTEMPTS:
            r.setex(_block_key(email), block_ttl, "1")
        return int(count)
    except Exception as exc:
        logger.warning("login_limiter.increment_fail error: %s", exc)
        return 0  # fail open


def reset_fails(email: str) -> None:
    """Elimina el contador y el bloqueo tras login exitoso."""
    try:
        _redis().delete(_fail_key(email), _block_key(email))
    except Exception as exc:
        logger.warning("login_limiter.reset_fails error: %s", exc)
