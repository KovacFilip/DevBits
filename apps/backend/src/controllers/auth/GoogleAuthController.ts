// import { CreateUserDTO } from '@devbits/shared/models/DTOs/UserDTO';
import { CreateUserDTO } from '@devbits/shared';
import oauthPlugin from '@fastify/oauth2';
import { FastifyInstance } from 'fastify';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { UserService } from '../../services/UserService';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuthRoutes = (fastify: FastifyInstance, options: Object) => {
    const userService = new UserService();

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

        const appJwt = jwt.sign(
            {
                userId: createdUser.userId,
                email: createdUser.email,
                name: payload.name,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        response.setCookie('token', appJwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
        });

        response.send({ payload: appJwt });
    });
};
