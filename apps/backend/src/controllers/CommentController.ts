import {
    LOGGER,
    SERVICE_IDENTIFIER,
} from 'apps/backend/src/constants/identifiers';
import { logControllerErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
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
import { Logger } from 'pino';

@injectable()
export class CommentController implements ICommentController {
    constructor(
        @inject(SERVICE_IDENTIFIER.COMMENT_SERVICE)
        readonly commentService: ICommentService,
        @inject(LOGGER.LOGGER) readonly logger: Logger
    ) {}

    async createComment(
        request: FastifyRequest<{ Body: CreateCommentDTO }>,
        response: FastifyReply<{ Reply: CommentDTO }>
    ): Promise<void> {
        try {
            const user = request.user;
            const newComment = await this.commentService.createComment(
                { userId: user.userId },
                {
                    ...request.body,
                }
            );

            return response.code(StatusCodes.OK).send(newComment);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'CommentController',
                method: 'createComment',
            });

            throw err;
        }
    }

    async getComment(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: CommentDTO }>
    ): Promise<void> {
        try {
            const { commentId } = request.params;

            const comment = await this.commentService.getComment({ commentId });

            return response.code(StatusCodes.OK).send(comment);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'CommentController',
                method: 'getComment',
            });

            throw err;
        }
    }

    async getCommentsForPost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: SimpleCommentDTO[] }>
    ): Promise<void> {
        try {
            const { postId } = request.params;

            const comments = await this.commentService.getCommentsForPost({
                postId,
            });

            return response.code(StatusCodes.OK).send(comments);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'CommentController',
                method: 'getCommentsForPost',
            });

            throw err;
        }
    }

    async getCommentsByUser(
        request: FastifyRequest<{ Params: UserIdDTO }>,
        response: FastifyReply<{ Reply: SimpleCommentDTO[] }>
    ): Promise<void> {
        try {
            const { userId } = request.params;

            const comments = await this.commentService.getCommentsByUser({
                userId,
            });

            return response.code(StatusCodes.OK).send(comments);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'CommentController',
                method: 'getCommentsByUser',
            });

            throw err;
        }
    }

    async updateComment(
        request: FastifyRequest<{
            Body: UpdateCommentDTO;
            Params: CommentIdDTO;
        }>,
        response: FastifyReply<{ Reply: CommentDTO }>
    ): Promise<void> {
        try {
            const updatedComment = await this.commentService.updateComment(
                request.params,
                request.body
            );

            return response.code(StatusCodes.OK).send(updatedComment);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'CommentController',
                method: 'updateComment',
            });

            throw err;
        }
    }

    async deleteComment(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: SimpleCommentDTO }>
    ): Promise<void> {
        try {
            const deletedComment = await this.commentService.deleteComment(
                request.params
            );

            return response.code(StatusCodes.OK).send(deletedComment);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'CommentController',
                method: 'deleteComment',
            });

            throw err;
        }
    }
}
