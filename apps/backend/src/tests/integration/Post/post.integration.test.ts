import { mikesPost } from 'apps/backend/prisma/seed/seedData';
import { buildServer } from 'apps/backend/src/server/buildServer';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { PostWithContentDTO, UserJWTPayload } from 'packages/shared';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('post integration tests', () => {
    let app: FastifyInstance;

    const jwtPayload: UserJWTPayload = {
        email: 'my@email.com',
        userId: 'test-user-id',
        name: 'Mike Ox-Long',
    };
    let jwtToken: string;

    beforeAll(async () => {
        app = await buildServer();
        await app.ready();

        jwtToken = app.jwt.sign(jwtPayload, { expiresIn: '1h' });
    });

    afterAll(async () => {
        await app.close();
    });

    it('request get post by non-existing id', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/post/276efe85-a684-4550-94dc-33150c7d173a',
            cookies: {
                access_token: jwtToken,
            },
        });

        expect(res.statusCode).toEqual(404);
    });

    it('request get post invalid id zod validation', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/post/post-123',
            cookies: {
                access_token: jwtToken,
            },
        });

        expect(res.payload).toEqual('{"message":"params/postId Invalid uuid"}');
        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('request get post by id', async () => {
        const res = await app.inject({
            method: 'GET',
            url: `/post/${mikesPost.postId}`,
            cookies: {
                access_token: jwtToken,
            },
        });

        expect(res.statusCode).toEqual(StatusCodes.OK);

        const body = JSON.parse(res.body) as PostWithContentDTO;
        expect(body.content).toEqual(mikesPost.content);
        expect(body.title).toEqual(mikesPost.title);
    });
});
