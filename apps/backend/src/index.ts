import fCookie from '@fastify/cookie';
import fjwt, { FastifyJWT } from '@fastify/jwt';
import * as dotenv from 'dotenv';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import { googleAuthRoutes } from './controllers/auth/GoogleAuthController';
import { commentRoutes } from './controllers/CommentController';
import { likeRoutes } from './controllers/LikeController';
import { postRoutes } from './controllers/PostController';
import { UserRoutes } from './controllers/UserController';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const server = fastify({
    logger: true,
});

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.log('The `JWT_SECRET` environment variable must be set');
    process.exit();
}

// jwt
server.register(fjwt, { secret: JWT_SECRET });
server.addHook('preHandler', (req, _, next) => {
    req.jwt = server.jwt;
    return next();
});

// cookies
server.register(fCookie, {
    secret: JWT_SECRET,
    hook: 'preHandler',
});

server.decorate(
    'authenticate',
    async (request: FastifyRequest, response: FastifyReply) => {
        const token = request.cookies.access_token;

        if (!token) {
            return response
                .status(401)
                .send({ success: false, message: 'Authentication required' });
        }

        const decoded = request.jwt.verify<FastifyJWT['user']>(token);

        request.user = decoded;
    }
);

server.register(googleAuthRoutes);
server.register(postRoutes);
server.register(commentRoutes);
server.register(likeRoutes);
server.register(UserRoutes);

/**
 * Run the server!
 */
const start = async () => {
    try {
        await server.listen({ port: 3000 });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
