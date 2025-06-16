import { PrismaClient } from 'apps/backend/prisma/generated/client';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

beforeEach(() => {
    mockReset(prisma);
});

const prisma = mockDeep<PrismaClient>();

export default prisma;
