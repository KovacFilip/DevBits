import fCookie from '@fastify/cookie';
import fjwt, { FastifyJWT } from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { container } from 'apps/backend/src/config/inversify.config';
import { LOGGER } from 'apps/backend/src/constants/identifiers';
import { googleAuthRoutes } from 'apps/backend/src/controllers/auth/GoogleAuthController';
import { ErrorHandler } from 'apps/backend/src/errors/ErrorHandler';
import { UnauthorizedError } from 'apps/backend/src/errors/UnauthorizedError';
import { CommentRoutes } from 'apps/backend/src/routes/CommentRoutes';
import { likeRoutes } from 'apps/backend/src/routes/LikeRoutes';
import { PostRoutes } from 'apps/backend/src/routes/PostRoutes';
import { UserRoutes } from 'apps/backend/src/routes/UserRoutes';
import {
    FastifyBaseLogger,
    FastifyInstance,
    FastifyRequest,
    fastify,
} from 'fastify';
import {
    ZodTypeProvider,
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod';
import { type Logger as PinoLogger } from 'pino';

export const buildServer = async (): Promise<FastifyInstance> => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error('The `JWT_SECRET` environment variable must be set');
    }

    const logger = container.get<PinoLogger>(LOGGER.LOGGER);

    const server = fastify({
        loggerInstance: logger as FastifyBaseLogger,
    }).withTypeProvider<ZodTypeProvider>();

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
                { name: 'auth', description: 'auth-related endpoints' },
                { name: 'user', description: 'user-related endpoints' },
                { name: 'post', description: 'post-related endpoints' },
                { name: 'comment', description: 'comment-related endpoints' },
                { name: 'like', description: 'like-related endpoints' },
            ],
            servers: [],
        },
        transform: jsonSchemaTransform,
    });

    server.register(fastifySwaggerUi, {
        routePrefix: '/documentation',
    });

    server.register(fjwt, { secret: JWT_SECRET });

    server.addHook('preHandler', (req, _, next) => {
        req.jwt = server.jwt;
        return next();
    });

    server.register(fCookie, {
        secret: JWT_SECRET,
        hook: 'preHandler',
    });

    server.decorate('authenticate', async (request: FastifyRequest) => {
        const token = request.cookies.access_token;

        if (!token) {
            throw new UnauthorizedError('Authentication required');
        }

        try {
            const decoded = request.jwt.verify<FastifyJWT['user']>(token);
            request.user = decoded;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            throw new UnauthorizedError(err.message);
        }
    });

    // Register routes
    server.register(googleAuthRoutes, { prefix: '/v1/auth' });
    server.register(PostRoutes, { prefix: '/v1/posts' });
    server.register(CommentRoutes, { prefix: '/v1/comments' });
    server.register(likeRoutes, { prefix: '/v1/likes' });
    server.register(UserRoutes);

    // Custom error handler
    server.setErrorHandler(ErrorHandler);

    return server;
};
