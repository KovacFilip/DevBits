import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { ICommentController } from 'apps/backend/src/models/interfaces/controllers/ICommentController';
import { ICommentService } from 'apps/backend/src/models/interfaces/services/ICommentService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import {
    CommentDTO,
    CommentIdDTO,
    CreateCommentDTO,
    PostIdDTO,
    SimpleCommentDTO,
    UpdateCommentDTO,
    UserIdDTO,
} from 'packages/shared';

@injectable()
export class CommentController implements ICommentController {
    constructor(
        @inject(SERVICE_IDENTIFIER.COMMENT_SERVICE)
        readonly commentService: ICommentService
    ) {}

    async createComment(
        request: FastifyRequest<{ Body: CreateCommentDTO }>,
        response: FastifyReply<{ Reply: CommentDTO }>
    ): Promise<void> {
        const user = request.user;
        const newComment = await this.commentService.createComment(
            { userId: user.userId },
            {
                ...request.body,
            }
        );

        return response.code(StatusCodes.OK).send(newComment);
    }

    async getComment(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: CommentDTO }>
    ): Promise<void> {
        const { commentId } = request.params;

        const comment = await this.commentService.getComment({ commentId });

        return response.code(StatusCodes.OK).send(comment);
    }

    async getCommentsForPost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: SimpleCommentDTO[] }>
    ): Promise<void> {
        const { postId } = request.params;

        const comments = await this.commentService.getCommentsForPost({
            postId,
        });

        return response.code(StatusCodes.OK).send(comments);
    }

    async getCommentsByUser(
        request: FastifyRequest<{ Params: UserIdDTO }>,
        response: FastifyReply<{ Reply: SimpleCommentDTO[] }>
    ): Promise<void> {
        const { userId } = request.params;

        const comments = await this.commentService.getCommentsByUser({
            userId,
        });

        return response.code(StatusCodes.OK).send(comments);
    }

    async updateComment(
        request: FastifyRequest<{
            Body: UpdateCommentDTO;
            Params: CommentIdDTO;
        }>,
        response: FastifyReply<{ Reply: CommentDTO }>
    ): Promise<void> {
        const updatedComment = await this.commentService.updateComment(
            request.params,
            request.body
        );

        return response.code(StatusCodes.OK).send(updatedComment);
    }

    async deleteComment(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: SimpleCommentDTO }>
    ): Promise<void> {
        const deletedComment = await this.commentService.deleteComment(
            request.params
        );

        return response.code(StatusCodes.OK).send(deletedComment);
    }
}
