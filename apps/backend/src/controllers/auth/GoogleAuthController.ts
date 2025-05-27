import oauthPlugin from '@fastify/oauth2';
import { container } from 'apps/backend/src/config/inversify.config';
import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { CreateUserDTO } from 'apps/backend/src/models/DTOs/UserDTO';
import { IUserService } from 'apps/backend/src/models/interfaces/services/IUserService';
import { FastifyInstance } from 'fastify';
import { OAuth2Client } from 'google-auth-library';
import { StatusCodes } from 'http-status-codes';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const userService = container.get<IUserService>(
    SERVICE_IDENTIFIER.USER_SERVICE
);

export const googleAuthRoutes = (fastify: FastifyInstance) => {
    fastify.register(oauthPlugin, {
        name: 'googleOAuth2',
        credentials: {
            client: {
                id: process.env.GOOGLE_CLIENT_ID!,
                secret: process.env.GOOGLE_CLIENT_SECRET!,
            },
            auth: oauthPlugin.GOOGLE_CONFIGURATION,
        },
        scope: ['email', 'profile'],
        startRedirectPath: '/auth/google',
        callbackUri: 'http://localhost:3000/auth/google/callback',
        tags: ['auth'],
        callbackUriParams: {
            access_type: 'offline',
        },
    });

    fastify.get(
        '/auth/google/callback',
        {
            schema: {
                tags: ['auth'],
            },
        },
        async (request, response) => {
            const tokenResponse =
                await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
                    request
                );

            const { id_token } = tokenResponse.token;

            if (!id_token) {
                return response
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .send();
            }

            const ticket = await googleClient.verifyIdToken({
                idToken: id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            if (!payload) {
                return response
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .send();
            }

            const userDto: CreateUserDTO = {
                email: payload.email || undefined,
                name: payload.name || undefined,
                profilePicture: payload.picture || undefined,
                provider: 'google',
                providerUserId: payload.sub,
            };

            const createdUser = await userService.registerUser(userDto);

            const jwtPayload = {
                userId: createdUser.userId,
                email: createdUser.email,
                name: payload.name,
            };

            const jwtToken = request.jwt.sign(jwtPayload, { expiresIn: '1h' });

            response.setCookie('access_token', jwtToken, {
                httpOnly: true,
                secure: true,
                path: '/',
            });

            return response.send({ payload: jwtToken });
        }
    );
};
