import { container } from 'apps/backend/src/config/inversify.config';
import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { handleDeleteUser } from 'apps/backend/src/controllers/UserController/Handlers/HandleDeleteUser';
import { handleGetUser } from 'apps/backend/src/controllers/UserController/Handlers/HandleGetUser';
import { handleUpdateUser } from 'apps/backend/src/controllers/UserController/Handlers/HandleUpdateUser';
import { IUserService } from 'apps/backend/src/models/interfaces/services/IUserService';
import { FastifyInstance } from 'fastify';
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
        handleGetUser(userService)
    );

    // Update
    fastify.put<{ Body: UpdateUserRequest }>(
        BASE_USER_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: { tags: ['user'], body: updateUserSchema },
        },
        handleUpdateUser(userService)
    );

    // Delete
    fastify.delete(
        BASE_USER_ROUTE,
        { preHandler: [fastify.authenticate], schema: { tags: ['user'] } },
        handleDeleteUser(userService)
    );
};
