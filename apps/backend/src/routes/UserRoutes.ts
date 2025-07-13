import { container } from 'apps/backend/src/config/inversify.config';
import { CONTROLLER_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { IUserController } from 'apps/backend/src/models/interfaces/controllers/IUserController';
import { FastifyInstance } from 'fastify';
import {
    UpdateUserDTO,
    updateUserSchema,
    UserDetailDTO,
    userDetailSchema,
    UserIdDTO,
    userIdSchema,
    UserSimpleDTO,
    userSimpleSchema,
} from 'packages/shared';

export const UserRoutes = (fastify: FastifyInstance) => {
    const userController = container.get<IUserController>(
        CONTROLLER_IDENTIFIER.USER_CONTROLLER
    );

    // Read
    fastify.get<{ Params: UserIdDTO; Reply: UserDetailDTO }>(
        '/:userId',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['user'],
                params: userIdSchema,
                response: {
                    200: userDetailSchema,
                },
            },
        },
        userController.getUser.bind(userController)
    );

    // Update
    fastify.patch<{ Body: UpdateUserDTO; Reply: UserDetailDTO }>(
        '',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['user'],
                body: updateUserSchema,
                response: {
                    200: userDetailSchema,
                },
            },
        },
        userController.updateUser.bind(userController)
    );

    // Delete
    fastify.delete<{ Reply: UserSimpleDTO }>(
        '',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['user'],
                response: {
                    200: userSimpleSchema,
                },
            },
        },
        userController.deleteUser.bind(userController)
    );
};
