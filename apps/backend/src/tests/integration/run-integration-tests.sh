#!/bin/bash

set -e

cat ./src/tests/integration/.env.test.integration

echo "===> Starting test database container..."
docker-compose -f ./src/tests/integration/docker-compose.integration.yml --env-file ./src/tests/integration/.env.test.integration  up -d

echo "===> Waiting for DB to be healthy..."
until docker exec integration_test_db_container pg_isready -U postgres > /dev/null 2>&1; do
  sleep 0.5
done

echo "===> Setting env to integration test env..."
export $(grep -v '^#' ./src/tests/integration/.env.test.integration | xargs)

echo "===> Running Prisma migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "===> Running integration tests..."
NODE_ENV=test pnpm vitest run --config vitest.integration.config.mts

echo "===> Cleaning up..."
docker compose -f ./src/tests/integration/docker-compose.integration.yml down
