import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { IUserController } from 'apps/backend/src/models/interfaces/controllers/IUserController';
import { IUserService } from 'apps/backend/src/models/interfaces/services/IUserService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { UpdateUserRequest, UserIdParams } from 'packages/shared';

@injectable()
export class UserController implements IUserController {
    constructor(
        @inject(SERVICE_IDENTIFIER.USER_SERVICE)
        readonly userService: IUserService
    ) {}

    async getUser(
        request: FastifyRequest<{ Querystring: UserIdParams }>,
        response: FastifyReply
    ): Promise<void> {
        const user = await this.userService.getUser(request.query);

        return response.code(StatusCodes.OK).send({ user });
    }

    async updateUser(
        request: FastifyRequest<{ Body: UpdateUserRequest }>,
        response: FastifyReply
    ): Promise<void> {
        const user = request.user;

        const updatedUser = await this.userService.updateUser({
            userId: user.userId,
            updateData: {
                ...request.body,
            },
        });

        return response.code(StatusCodes.OK).send({ updatedUser });
    }

    async deleteUser(
        request: FastifyRequest,
        response: FastifyReply
    ): Promise<void> {
        const deletedUser = await this.userService.deleteUser({
            userId: request.user.userId,
        });

        return response.code(StatusCodes.OK).send({ deletedUser });
    }
}
