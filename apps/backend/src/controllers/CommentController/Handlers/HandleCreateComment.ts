import { ICommentService } from 'apps/backend/src/models/interfaces/services/ICommentService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { CreateCommentRequest } from 'packages/shared';

export const handleCreateComment =
    (commentService: ICommentService) =>
    async (
        request: FastifyRequest<{ Body: CreateCommentRequest }>,
        response: FastifyReply
    ) => {
        const user = request.user;
        const newComment = await commentService.createComment({
            userId: user.userId,
            ...request.body,
        });

        return response.code(StatusCodes.OK).send({ newComment });
    };
