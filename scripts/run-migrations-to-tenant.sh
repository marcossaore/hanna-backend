#!/bin/bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli migration:run -d ./infra/db/companies/data-source.ts