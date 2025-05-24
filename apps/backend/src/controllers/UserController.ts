import { FastifyInstance } from 'fastify';
import {
    UpdateUserRequest,
    updateUserSchema,
    UserIdParams,
    userIdSchema,
} from 'packages/shared';
import { container } from '../config/inversify.config';
import { SERVICE_IDENTIFIER } from '../constants/identifiers';
import { IUserService } from '../models/interfaces/services/IUserService';

export const BASE_USER_ROUTE = '/user';

const userService = container.get<IUserService>(
    SERVICE_IDENTIFIER.USER_SERVICE
);

export const UserRoutes = (fastify: FastifyInstance) => {
    // Get user info
    fastify.get<{ Querystring: UserIdParams }>(
        BASE_USER_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['user'],
                querystring: userIdSchema,
            },
        },
        async (request, response) => {
            const user = await userService.getUser(request.query);

            return response.code(200).send({ success: true, user });
        }
    );

    // Update
    fastify.put<{ Body: UpdateUserRequest }>(
        BASE_USER_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: { tags: ['user'], body: updateUserSchema },
        },
        async (request, response) => {
            const user = request.user;

            const updatedUser = await userService.updateUser({
                userId: user.userId,
                updateData: {
                    ...request.body,
                },
            });

            return response.code(200).send({ success: true, updatedUser });
        }
    );

    // Delete
    fastify.delete(
        BASE_USER_ROUTE,
        { preHandler: [fastify.authenticate], schema: { tags: ['user'] } },
        async (request, response) => {
            const deletedUser = await userService.deleteUser({
                userId: request.user.userId,
            });

            return response.code(200).send({ success: true, deletedUser });
        }
    );
};
