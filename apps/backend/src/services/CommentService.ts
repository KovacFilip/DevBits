import {
    LOGGER,
    REPOSITORY_IDENTIFIER,
} from 'apps/backend/src/constants/identifiers';
import { NotFoundError } from 'apps/backend/src/errors/NotFoundError';
import { logServiceErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import { ICommentRepository } from 'apps/backend/src/models/interfaces/repositories/ICommentRepository';
import { ICommentService } from 'apps/backend/src/models/interfaces/services/ICommentService';
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
export class CommentService implements ICommentService {
    constructor(
        @inject(REPOSITORY_IDENTIFIER.COMMENT_REPOSITORY)
        private readonly commentRepository: ICommentRepository,
        @inject(LOGGER.LOGGER) private readonly logger: Logger
    ) {}

    async createComment(
        userIdDTO: UserIdDTO,
        createCommentDto: CreateCommentDTO
    ): Promise<CommentDTO> {
        try {
            const comment = await this.commentRepository.createComment({
                content: createCommentDto.content,
                postId: createCommentDto.postId,
                userId: userIdDTO.userId,
                parentCommentId: createCommentDto.parentCommentId,
            });

            return {
                commentId: comment.id,
                postId: comment.postId,
                userId: comment.userId,
                content: comment.content,
                parentCommentId: comment.parentCommentId ?? undefined,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { userIdDTO, createCommentDto },
                service: 'CommentService',
                method: 'createComment',
            });

            throw err;
        }
    }

    async getComment(dto: CommentIdDTO): Promise<CommentDTO> {
        try {
            const comment = await this.commentRepository.readComment(
                dto.commentId
            );

            if (!comment) {
                throw new NotFoundError(
                    `Unable to find comment with id: ${dto.commentId}`
                );
            }

            return {
                commentId: comment.id,
                postId: comment.postId,
                userId: comment.userId,
                content: comment.content,
                parentCommentId: comment.parentCommentId ?? undefined,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'CommentService',
                method: 'getComment',
            });

            throw err;
        }
    }

    async getCommentsForPost(dto: PostIdDTO): Promise<SimpleCommentDTO[]> {
        try {
            const comments = await this.commentRepository.readCommentForPost(
                dto.postId
            );

            if (!comments) {
                throw new Error(
                    `Comments for post with id: ${dto.postId} were not found`
                );
            }

            return comments.map((comment) => {
                return {
                    commentId: comment.id,
                    content: comment.content,
                };
            });
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'CommentService',
                method: 'getComment',
            });

            throw err;
        }
    }

    async getCommentsByUser(dto: UserIdDTO): Promise<SimpleCommentDTO[]> {
        try {
            const comments = await this.commentRepository.readCommentForUser(
                dto.userId
            );

            if (!comments) {
                throw new Error(
                    `Comments for user with id: ${dto.userId} were not found`
                );
            }

            return comments.map((comment) => {
                return {
                    commentId: comment.id,
                    content: comment.content,
                };
            });
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'CommentService',
                method: 'getCommentsByUser',
            });

            throw err;
        }
    }

    async updateComment(
        commentIdDto: CommentIdDTO,
        newCommentData: UpdateCommentDTO
    ): Promise<CommentDTO> {
        try {
            const updatedComment = await this.commentRepository.updateComment(
                commentIdDto.commentId,
                {
                    content: newCommentData.content,
                }
            );

            return {
                commentId: updatedComment.id,
                userId: updatedComment.userId,
                postId: updatedComment.postId,
                content: updatedComment.content,
                parentCommentId: updatedComment.parentCommentId ?? undefined,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { commentIdDto, newCommentData },
                service: 'CommentService',
                method: 'updateComment',
            });

            throw err;
        }
    }

    async deleteComment(dto: CommentIdDTO): Promise<SimpleCommentDTO> {
        try {
            const deletedComment =
                await this.commentRepository.softDeleteComment(dto.commentId);

            return {
                commentId: deletedComment.id,
                content: deletedComment.content,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'CommentService',
                method: 'deleteComment',
            });

            throw err;
        }
    }
}
