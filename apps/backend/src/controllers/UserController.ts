import {
    LOGGER,
    SERVICE_IDENTIFIER,
} from 'apps/backend/src/constants/identifiers';
import { logControllerErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import { IUserController } from 'apps/backend/src/models/interfaces/controllers/IUserController';
import { IUserService } from 'apps/backend/src/models/interfaces/services/IUserService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import {
    UpdateUserDTO,
    UserDetailDTO,
    UserIdDTO,
    UserSimpleDTO,
} from 'packages/shared';
import { Logger } from 'pino';

@injectable()
export class UserController implements IUserController {
    constructor(
        @inject(SERVICE_IDENTIFIER.USER_SERVICE)
        readonly userService: IUserService,
        @inject(LOGGER.LOGGER) readonly logger: Logger
    ) {}

    async getUser(
        request: FastifyRequest<{ Params: UserIdDTO }>,
        response: FastifyReply<{ Reply: UserDetailDTO }>
    ): Promise<void> {
        try {
            const user = await this.userService.getUser(request.params);

            return response.code(StatusCodes.OK).send(user);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'UserController',
                method: 'getUser',
            });

            throw err;
        }
    }

    async updateUser(
        request: FastifyRequest<{ Body: UpdateUserDTO }>,
        response: FastifyReply<{ Reply: UserDetailDTO }>
    ): Promise<void> {
        try {
            const updatedUser = await this.userService.updateUser(
                request.user,
                request.body
            );

            return response.code(StatusCodes.OK).send(updatedUser);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'UserController',
                method: 'updateUser',
            });

            throw err;
        }
    }

    async deleteUser(
        request: FastifyRequest,
        response: FastifyReply<{ Reply: UserSimpleDTO }>
    ): Promise<void> {
        try {
            const deletedUser = await this.userService.deleteUser(request.user);

            return response.code(StatusCodes.OK).send(deletedUser);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'UserController',
                method: 'deleteUser',
            });

            throw err;
        }
    }
}
