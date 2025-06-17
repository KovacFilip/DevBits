import { PrismaClient } from 'apps/backend/prisma/generated/client';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

beforeEach(() => {
    mockReset(prisma);
});

// For prisma mocking, I need to use mockDeep, because I need to mock scenarios like: `prisma.x.y`, where x is entity, y is prisma method
const prisma = mockDeep<PrismaClient>();

export default prisma;
