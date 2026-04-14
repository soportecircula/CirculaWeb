#! /usr/bin/env bash
set -e

# Correr prestart (DB check + migraciones + initial data)
bash /app/backend/scripts/prestart.sh

# Arrancar servidor usando $PORT de Railway (o 8000 como fallback local)
exec /app/.venv/bin/fastapi run --workers 2 /app/backend/app/main.py --port "${PORT:-8000}"
