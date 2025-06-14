import { FastifyReply, FastifyRequest } from 'fastify';
import {
    UpdateUserDTO,
    UserDetailDTO,
    UserIdDTO,
    UserSimpleDTO,
} from 'packages/shared';

export interface IUserController {
    getUser(
        request: FastifyRequest<{ Querystring: UserIdDTO }>,
        response: FastifyReply<{ Reply: UserDetailDTO }>
    ): Promise<void>;

    updateUser(
        request: FastifyRequest<{ Body: UpdateUserDTO }>,
        response: FastifyReply<{ Reply: UserDetailDTO }>
    ): Promise<void>;

    deleteUser(
        request: FastifyRequest,
        response: FastifyReply<{ Reply: UserSimpleDTO }>
    ): Promise<void>;
}
