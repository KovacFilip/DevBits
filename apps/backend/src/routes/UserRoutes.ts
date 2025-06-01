import { container } from 'apps/backend/src/config/inversify.config';
import { CONTROLLER_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { IUserController } from 'apps/backend/src/models/interfaces/controllers/IUserController';
import { FastifyInstance } from 'fastify';
import {
    UpdateUserRequest,
    updateUserSchema,
    UserIdParams,
    userIdSchema,
} from 'packages/shared';

export const BASE_USER_ROUTE = '/user';

export const UserRoutes = (fastify: FastifyInstance) => {
    const userController = container.get<IUserController>(
        CONTROLLER_IDENTIFIER.USER_CONTROLLER
    );

    // Read
    fastify.get<{ Querystring: UserIdParams }>(
        BASE_USER_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['user'],
                querystring: userIdSchema,
            },
        },
        userController.getUser.bind(userController)
    );

    // Update
    fastify.put<{ Body: UpdateUserRequest }>(
        BASE_USER_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: { tags: ['user'], body: updateUserSchema },
        },
        userController.updateUser.bind(userController)
    );

    // Delete
    fastify.delete(
        BASE_USER_ROUTE,
        { preHandler: [fastify.authenticate], schema: { tags: ['user'] } },
        userController.deleteUser.bind(userController)
    );
};
