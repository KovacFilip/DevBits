import { ICommentService } from 'apps/backend/src/models/interfaces/services/ICommentService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { CommentIdParams } from 'packages/shared';

export const handleDeleteComment = (commentService: ICommentService) => {
    return async (
        request: FastifyRequest<{ Querystring: CommentIdParams }>,
        response: FastifyReply
    ) => {
        const deletedComment = await commentService.deleteComment(
            request.query
        );

        return response.code(StatusCodes.OK).send({ deletedComment });
    };
};
