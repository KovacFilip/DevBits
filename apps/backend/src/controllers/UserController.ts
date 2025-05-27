import { container } from 'apps/backend/src/config/inversify.config';
import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { IUserService } from 'apps/backend/src/models/interfaces/services/IUserService';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import {
    UpdateUserRequest,
    updateUserSchema,
    UserIdParams,
    userIdSchema,
} from 'packages/shared';

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

            return response.code(StatusCodes.OK).send({ user });
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

            return response.code(StatusCodes.OK).send({ updatedUser });
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

            return response.code(StatusCodes.OK).send({ deletedUser });
        }
    );
};
