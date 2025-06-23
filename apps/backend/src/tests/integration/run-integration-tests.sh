#!/bin/bash

echo "===> Starting test database container..."
docker-compose -f ./src/tests/integration/docker-compose.integration.yml --env-file ./src/tests/integration/.env.test.integration  up -d

DIR="$(cd "$(dirname "$0")" && pwd)"

# # If POSTGRES_DB_CONNECTION_STRING is not set, assume we're running locally and load the env file
if [[ -z "$POSTGRES_DB_CONNECTION_STRING" ]]; then
  echo "===> Setting env to integration test env (local fallback)..."
  export $(grep -v '^#' ./src/tests/integration/.env.test.integration | xargs)
fi

echo 'Waiting for database to be ready...'
$DIR/wait-for-it.sh -h 0.0.0.0 -p 5432 -- echo 'Database is ready!'

npx prisma migrate dev

tsx ./prisma/seed/seed.ts

vitest -c ./vitest.integration.config.mts

echo "===> Cleaning up..."
docker compose -f ./src/tests/integration/docker-compose.integration.yml down
