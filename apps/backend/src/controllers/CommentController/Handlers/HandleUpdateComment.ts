import { UpdateCommentDTO } from 'apps/backend/src/models/DTOs/CommentDTO';
import { ICommentService } from 'apps/backend/src/models/interfaces/services/ICommentService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { CommentIdParams, UpdateCommentRequestBody } from 'packages/shared';

export const handleUpdateComment = (commentService: ICommentService) => {
    return async (
        request: FastifyRequest<{
            Body: UpdateCommentRequestBody;
            Querystring: CommentIdParams;
        }>,
        response: FastifyReply
    ) => {
        const updateCommentDTO: UpdateCommentDTO = {
            commentId: request.query.commentId,
            updateData: {
                content: request.body.content,
            },
        };

        const updatedComment =
            await commentService.updateComment(updateCommentDTO);

        return response.code(StatusCodes.OK).send({ updatedComment });
    };
};
