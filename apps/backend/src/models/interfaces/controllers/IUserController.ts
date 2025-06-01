import { FastifyReply, FastifyRequest } from 'fastify';

export interface IUserController {
    getUser(request: FastifyRequest, response: FastifyReply): Promise<void>;
    updateUser(request: FastifyRequest, response: FastifyReply): Promise<void>;
    deleteUser(request: FastifyRequest, response: FastifyReply): Promise<void>;
}
