"""Redis service — cliente singleton con pool de conexiones."""
from __future__ import annotations

import json
import logging
from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator

import redis.asyncio as aioredis
from redis.asyncio import Redis

from app.core.config import settings

logger = logging.getLogger(__name__)

# ── Singleton ──────────────────────────────────────────────────────────────────

_pool: aioredis.ConnectionPool | None = None
_client: Redis | None = None  # type: ignore[type-arg]


def _build_pool() -> aioredis.ConnectionPool:
    return aioredis.ConnectionPool.from_url(
        settings.REDIS_URL,
        max_connections=20,
        decode_responses=True,
        socket_connect_timeout=2,
        socket_timeout=2,
        retry_on_timeout=True,
    )


async def get_redis() -> Redis:  # type: ignore[type-arg]
    """Retorna el cliente Redis singleton (lazy-init)."""
    global _pool, _client
    if _client is None:
        _pool = _build_pool()
        _client = aioredis.Redis(connection_pool=_pool)
    return _client


async def close_redis() -> None:
    global _pool, _client
    if _client:
        await _client.aclose()
        _client = None
    if _pool:
        await _pool.aclose()
        _pool = None


@asynccontextmanager
async def redis_ctx() -> AsyncGenerator[Redis, None]:  # type: ignore[type-arg]
    """Context manager para obtener Redis (útil en lifespan)."""
    r = await get_redis()
    try:
        yield r
    finally:
        pass  # pool se cierra en shutdown


# ── Namespacing de claves ──────────────────────────────────────────────────────

class RedisKeys:
    """Convenciones de claves. Prefijo: circula:{env}"""

    _ENV = settings.ENVIRONMENT  # local | staging | production

    @classmethod
    def _p(cls, *parts: str) -> str:
        return f"circula:{cls._ENV}:" + ":".join(parts)

    # ── Sesiones de usuario ──────────────────────────────────────────────
    @classmethod
    def user_session(cls, user_id: str) -> str:
        """Datos de sesión extendida del usuario."""
        return cls._p("session", user_id)

    # ── Rate limiting ────────────────────────────────────────────────────
    @classmethod
    def rate_limit(cls, identifier: str) -> str:
        return cls._p("rl", identifier)


# ── Helpers de alto nivel ─────────────────────────────────────────────────────

async def cache_get(redis: Redis, key: str) -> Any | None:  # type: ignore[type-arg]
    """Lee y deserializa un valor JSON de Redis. Retorna None en fallo."""
    try:
        raw = await redis.get(key)
        if raw is None:
            return None
        return json.loads(raw)
    except Exception as exc:
        logger.warning("Redis cache_get error key=%s: %s", key, exc)
        return None


async def cache_set(
    redis: Redis,  # type: ignore[type-arg]
    key: str,
    value: Any,
    ttl: int | None = None,
) -> bool:
    """Serializa a JSON y escribe en Redis con TTL opcional."""
    try:
        serialized = json.dumps(value, default=str)
        if ttl:
            await redis.setex(key, ttl, serialized)
        else:
            await redis.set(key, serialized)
        return True
    except Exception as exc:
        logger.warning("Redis cache_set error key=%s: %s", key, exc)
        return False


async def cache_delete(redis: Redis, *keys: str) -> None:  # type: ignore[type-arg]
    """Elimina una o más claves de Redis."""
    try:
        if keys:
            await redis.delete(*keys)
    except Exception as exc:
        logger.warning("Redis cache_delete error: %s", exc)


async def cache_delete_pattern(redis: Redis, pattern: str) -> int:  # type: ignore[type-arg]
    """Elimina todas las claves que coincidan con el patrón. Retorna cantidad."""
    try:
        keys = await redis.keys(pattern)
        if keys:
            await redis.delete(*keys)
        return len(keys)
    except Exception as exc:
        logger.warning("Redis cache_delete_pattern error pattern=%s: %s", pattern, exc)
        return 0
