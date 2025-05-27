import { IUserService } from 'apps/backend/src/models/interfaces/services/IUserService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';

export const handleDeleteUser = (userService: IUserService) => {
    return async (request: FastifyRequest, response: FastifyReply) => {
        const deletedUser = await userService.deleteUser({
            userId: request.user.userId,
        });

        return response.code(StatusCodes.OK).send({ deletedUser });
    };
};
