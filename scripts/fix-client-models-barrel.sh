#!/usr/bin/env bash
# Post-generation fix: ensures all model files in src/client/models/ are exported
# in the models.ts barrel. ng-openapi sometimes omits newly added schemas.
set -e

MODELS_DIR="frontend/src/client/models"
BARREL="frontend/src/client/models.ts"

added=0

for f in "$MODELS_DIR"/*.ts; do
  base=$(basename "$f" .ts)
  [[ "$base" == "index" ]] && continue

  # Convert kebab-case to PascalCase (used to check if already present)
  pascal=$(echo "$base" | awk -F'-' '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2); print}' OFS='')

  # Check if already exported (by PascalCase name or file path)
  if grep -q "$pascal\|$base" "$BARREL"; then
    continue
  fi

  # Detect whether the file exports an interface/type or a const
  if grep -q "^export interface\|^export type\|^export enum" "$f"; then
    echo "export type { $pascal } from './models/$base';" >> "$BARREL"
    echo "  + Added type export: $pascal"
  elif grep -qE "^export const ([A-Z_]+)" "$f"; then
    const_name=$(grep -oE "^export const [A-Z_]+" "$f" | head -1 | awk '{print $3}')
    echo "export { $const_name } from './models/$base';" >> "$BARREL"
    echo "  + Added const export: $const_name (from $base)"
  fi

  added=$((added + 1))
done

if [ "$added" -eq 0 ]; then
  echo "  ✓ models.ts barrel already complete"
else
  echo "  ✓ Added $added missing export(s) to models.ts"
fi
