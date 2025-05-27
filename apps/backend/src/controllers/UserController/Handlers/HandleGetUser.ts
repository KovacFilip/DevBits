import { IUserService } from 'apps/backend/src/models/interfaces/services/IUserService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { UserIdParams } from 'packages/shared';

export const handleGetUser = (userService: IUserService) => {
    return async (
        request: FastifyRequest<{ Querystring: UserIdParams }>,
        response: FastifyReply
    ) => {
        const user = await userService.getUser(request.query);

        return response.code(StatusCodes.OK).send({ user });
    };
};
