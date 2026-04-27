#!/usr/bin/env bash

set -e
set -x

export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

cd backend
uv run python -c "import app.main; import json; print(json.dumps(app.main.app.openapi()))" > ../openapi.json
cd ..
mv openapi.json frontend/swagger.json
cd frontend
bun run generate:client
cd ..
bash scripts/fix-client-models-barrel.sh
