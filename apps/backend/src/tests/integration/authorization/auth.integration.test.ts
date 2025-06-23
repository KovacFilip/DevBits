import { buildServer } from 'apps/backend/src/server/buildServer';
import { FastifyInstance } from 'fastify';
import { UserJWTPayload } from 'packages/shared';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('authorization integration tests', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = await buildServer();
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('request without access-token cookie returns unauthorized', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/post/276efe85-a684-4550-94dc-33150c7d173a',
        });

        expect(res.statusCode).toBe(401);
    });

    it('request with access-token cookie does not return unauthorized', async () => {
        const jwtPayload: UserJWTPayload = {
            email: 'my@email.com',
            userId: 'test-user-id',
            name: 'Mike Ox-Long',
        };

        const jwtToken = app.jwt.sign(jwtPayload, { expiresIn: '1h' });
        const res = await app.inject({
            method: 'GET',
            url: '/post/276efe85-a684-4550-94dc-33150c7d173a',
            cookies: {
                access_token: jwtToken,
            },
        });

        expect([200, 404]).toContain(res.statusCode);
    });
});
