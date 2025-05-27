import { container } from 'apps/backend/src/config/inversify.config';
import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { createHandleDeleteUser } from 'apps/backend/src/controllers/UserController/Factories/CreateHandleDeleteUser';
import { createHandleGetUser } from 'apps/backend/src/controllers/UserController/Factories/CreateHandleGetUser';
import { createHandleUpdateUser } from 'apps/backend/src/controllers/UserController/Factories/CreateHandleUpdateUser';
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
    const handleGetUser = createHandleGetUser(userService);
    const handleUpdateUser = createHandleUpdateUser(userService);
    const handleDeleteUser = createHandleDeleteUser(userService);

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
        handleGetUser
    );

    // Update
    fastify.put<{ Body: UpdateUserRequest }>(
        BASE_USER_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: { tags: ['user'], body: updateUserSchema },
        },
        handleUpdateUser
    );

    // Delete
    fastify.delete(
        BASE_USER_ROUTE,
        { preHandler: [fastify.authenticate], schema: { tags: ['user'] } },
        handleDeleteUser
    );
};
