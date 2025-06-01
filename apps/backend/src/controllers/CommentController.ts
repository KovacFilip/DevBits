import { MISSING_REQUIRED_QUERY_PARAMS } from 'apps/backend/src/constants/errorMessages';
import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { UpdateCommentDTO } from 'apps/backend/src/models/DTOs/CommentDTO';
import { ICommentController } from 'apps/backend/src/models/interfaces/controllers/ICommentController';
import { ICommentService } from 'apps/backend/src/models/interfaces/services/ICommentService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import {
    CommentIdParams,
    CreateCommentRequest,
    GetCommentRequest,
    UpdateCommentRequestBody,
} from 'packages/shared';

@injectable()
export class CommentController implements ICommentController {
    constructor(
        @inject(SERVICE_IDENTIFIER.COMMENT_SERVICE)
        readonly commentService: ICommentService
    ) {}

    async createComment(
        request: FastifyRequest<{ Body: CreateCommentRequest }>,
        response: FastifyReply
    ): Promise<void> {
        const user = request.user;
        const newComment = await this.commentService.createComment({
            userId: user.userId,
            ...request.body,
        });

        return response.code(StatusCodes.OK).send({ newComment });
    }

    async getComment(
        request: FastifyRequest<{ Querystring: GetCommentRequest }>,
        response: FastifyReply
    ): Promise<void> {
        const { commentId, postId, userId } = request.query;

        if (commentId) {
            const comment = await this.commentService.getComment({ commentId });
            return response.code(StatusCodes.OK).send({ comment });
        }

        if (postId) {
            const comments = await this.commentService.getCommentsForPost({
                postId,
            });
            return response.code(StatusCodes.OK).send({ comments });
        }

        if (userId) {
            const comments = await this.commentService.getCommentsByUser({
                userId,
            });
            return response.code(StatusCodes.OK).send({ comments });
        }

        // Should be a dead code due to validation
        return response.code(StatusCodes.BAD_REQUEST).send({
            message: MISSING_REQUIRED_QUERY_PARAMS,
        });
    }

    async updateComment(
        request: FastifyRequest<{
            Body: UpdateCommentRequestBody;
            Querystring: CommentIdParams;
        }>,
        response: FastifyReply
    ): Promise<void> {
        const updateCommentDTO: UpdateCommentDTO = {
            commentId: request.query.commentId,
            updateData: {
                content: request.body.content,
            },
        };

        const updatedComment =
            await this.commentService.updateComment(updateCommentDTO);

        return response.code(StatusCodes.OK).send({ updatedComment });
    }

    async deleteComment(
        request: FastifyRequest<{ Querystring: CommentIdParams }>,
        response: FastifyReply
    ): Promise<void> {
        const deletedComment = await this.commentService.deleteComment(
            request.query
        );

        return response.code(StatusCodes.OK).send({ deletedComment });
    }
}
