#!/bin/bash
if [ $# -ne 1 ]; then
  echo "Usage: $0 <fileName>"
  exit 1
fi

FILENAME="$1"

npx typeorm-ts-node-esm migration:create ./db/companies/migrations/${FILENAME}