import { JWT } from '@fastify/jwt';
import { OAuth2Namespace } from '@fastify/oauth2';
import { UserJWTPayload } from 'packages/shared';

declare module 'fastify' {
    interface FastifyInstance {
        facebookOAuth2: OAuth2Namespace;
        googleOAuth2: OAuth2Namespace;
        authenticate: (
            request: FastifyRequest,
            reply: FastifyReply
        ) => Promise<void>;
    }

    interface FastifyRequest {
        jwt: JWT;
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: UserJWTPayload;
    }
}
