#!/bin/bash
if [ $# -ne 1 ]; then
  echo "Usage: $0 <fileName>"
  exit 1
fi

FILENAME="$1"

npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli migration:create ./db/companies/migrations/${FILENAME}