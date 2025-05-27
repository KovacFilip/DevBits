import { MISSING_REQUIRED_QUERY_PARAMS } from 'apps/backend/src/constants/errorMessages';
import { ICommentService } from 'apps/backend/src/models/interfaces/services/ICommentService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { GetCommentRequest } from 'packages/shared';

export const handleGetComment = (commentService: ICommentService) => {
    return async (
        request: FastifyRequest<{ Querystring: GetCommentRequest }>,
        response: FastifyReply
    ) => {
        const { commentId, postId, userId } = request.query;

        if (commentId) {
            const comment = await commentService.getComment({ commentId });
            return response.code(StatusCodes.OK).send({ comment });
        }

        if (postId) {
            const comments = await commentService.getCommentsForPost({
                postId,
            });
            return response.code(StatusCodes.OK).send({ comments });
        }

        if (userId) {
            const comments = await commentService.getCommentsByUser({
                userId,
            });
            return response.code(StatusCodes.OK).send({ comments });
        }

        // Should be a dead code
        return response.code(StatusCodes.BAD_REQUEST).send({
            message: MISSING_REQUIRED_QUERY_PARAMS,
        });
    };
};
