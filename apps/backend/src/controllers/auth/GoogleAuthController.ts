// import { CreateUserDTO } from '@devbits/shared/models/DTOs/UserDTO';
import { CreateUserDTO } from '@devbits/shared';
import oauthPlugin from '@fastify/oauth2';
import { FastifyInstance } from 'fastify';
import { OAuth2Client } from 'google-auth-library';
import { container } from '../../config/inversify.config';
import { SERVICE_IDENTIFIER } from '../../constants/identifiers';
import { IUserService } from '../../models/interfaces/services/IUserService';

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
        callbackUriParams: {
            access_type: 'offline',
        },
    });

    fastify.get('/auth/google/callback', async (request, response) => {
        const tokenResponse =
            await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
                request
            );

        const { id_token } = tokenResponse.token;

        if (!id_token) {
            return response.status(500).send();
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return response.status(500).send();
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
    });
};
