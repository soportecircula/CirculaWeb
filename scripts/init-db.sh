#!/bin/bash
set -e

# Inicialización de base de datos para Circula
# Solo crea la BD principal (definida por POSTGRES_DB en el entorno)
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT 1;
EOSQL
