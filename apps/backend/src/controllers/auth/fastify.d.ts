import { OAuth2Namespace } from '@fastify/oauth2';

declare module 'fastify' {
    interface FastifyInstance {
        facebookOAuth2: OAuth2Namespace;
        googleOAuth2: OAuth2Namespace;
    }
}
