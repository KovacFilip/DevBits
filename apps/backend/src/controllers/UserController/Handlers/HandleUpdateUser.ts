import { IUserService } from 'apps/backend/src/models/interfaces/services/IUserService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { UpdateUserRequest } from 'packages/shared';

export const handleUpdateUser = (userService: IUserService) => {
    return async (
        request: FastifyRequest<{ Body: UpdateUserRequest }>,
        response: FastifyReply
    ) => {
        const user = request.user;

        const updatedUser = await userService.updateUser({
            userId: user.userId,
            updateData: {
                ...request.body,
            },
        });

        return response.code(StatusCodes.OK).send({ updatedUser });
    };
};
