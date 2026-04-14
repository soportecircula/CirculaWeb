FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED=1

# curl necesario para healthcheck en compose.yml
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:0.9.26 /uv /uvx /bin/

ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

WORKDIR /app/

ENV PATH="/app/.venv/bin:$PATH"

# Copiar archivos de workspace (necesarios para uv sync)
COPY uv.lock pyproject.toml /app/

# Instalar dependencias del workspace sin instalar el paquete app todavía
RUN uv sync --frozen --no-install-workspace --package app

COPY ./backend/scripts /app/backend/scripts

COPY ./backend/pyproject.toml ./backend/alembic.ini /app/backend/

COPY ./backend/app /app/backend/app
COPY ./backend/tests /app/backend/tests

# Instalar el paquete app en el virtualenv
RUN uv sync --frozen --package app

WORKDIR /app/backend/

CMD ["fastapi", "run", "--workers", "4", "app/main.py"]
