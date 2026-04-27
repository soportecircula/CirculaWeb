import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import sentry_sdk
from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings
from app.core.init_minio import init_minio
from app.core.rate_limit import limiter
from app.core.redis import close_redis, get_redis

logger = logging.getLogger(__name__)


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # Startup
    try:
        init_minio()
    except Exception:
        logger.exception("MinIO init failed — continuing without MinIO")
    try:
        redis = await get_redis()
        await redis.ping()
        logger.info("Redis conectado correctamente")
    except Exception:
        logger.warning("Redis no disponible al iniciar — cache deshabilitada")
    yield
    # Shutdown
    await close_redis()
    logger.info("Redis desconectado")


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
    lifespan=lifespan,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore[arg-type]

# CORS
_origins = ["*"] if settings.ENVIRONMENT == "local" else settings.all_cors_origins
if _origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

# Servir archivos locales solo cuando el storage backend es local
if settings.STORAGE_BACKEND == "local":
    from pathlib import Path

    _upload_dir = Path(settings.UPLOAD_DIR)
    _upload_dir.mkdir(parents=True, exist_ok=True)
    app.mount("/api/v1/uploads", StaticFiles(directory=str(_upload_dir)), name="uploads")

# Assets estáticos del backend (logo para emails, etc.)
from pathlib import Path as _Path
_static_dir = _Path(__file__).parent / "static"
_static_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(_static_dir)), name="static")
