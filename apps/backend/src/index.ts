import fCookie from '@fastify/cookie';
import fjwt, { FastifyJWT } from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { googleAuthRoutes } from 'apps/backend/src/controllers/auth/GoogleAuthController';
import { commentRoutes } from 'apps/backend/src/controllers/CommentController/CommentController';
import { likeRoutes } from 'apps/backend/src/controllers/LikeController';
import { postRoutes } from 'apps/backend/src/controllers/PostController';
import { UserRoutes } from 'apps/backend/src/controllers/UserController';
import { ErrorHandler } from 'apps/backend/src/errors/ErrorHandler';
import { UnauthorizedError } from 'apps/backend/src/errors/UnauthorizedError';
import * as dotenv from 'dotenv';
import fastify, { FastifyRequest } from 'fastify';
import {
    ZodTypeProvider,
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const server = fastify({
    logger: true,
}).withTypeProvider<ZodTypeProvider>();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.log('The `JWT_SECRET` environment variable must be set');
    process.exit();
}

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Swagger
server.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'DevBits API',
            description: 'Dev Bits API Description',
            version: '1.0.0',
        },
        tags: [
            {
                name: 'auth',
                description: 'auth-related endpoints',
            },
            {
                name: 'user',
                description: 'user-related endpoints',
            },
            {
                name: 'post',
                description: 'post-related endpoints',
            },
            {
                name: 'comment',
                description: 'comment-related endpoints',
            },
            {
                name: 'like',
                description: 'like-related endpoints',
            },
        ],
        servers: [],
    },
    transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
});

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

server.decorate('authenticate', async (request: FastifyRequest) => {
    const token = request.cookies.access_token;

    if (!token) {
        throw new UnauthorizedError('Authentication required');
    }

    const decoded = request.jwt.verify<FastifyJWT['user']>(token);

    request.user = decoded;
});

server.register(googleAuthRoutes);
server.register(postRoutes);
server.register(commentRoutes);
server.register(likeRoutes);
server.register(UserRoutes);

// Custom error handling middleware
server.setErrorHandler(ErrorHandler);

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
