import { Prisma } from 'apps/backend/prisma/generated/client';
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
            const commentToCreate: Prisma.CommentCreateInput = {
                user: { connect: { userId: userIdDTO.userId } },
                post: { connect: { postId: createCommentDto.postId } },
                content: createCommentDto.content,
                ...(createCommentDto.parentCommentId && {
                    parentComment: {
                        connect: {
                            commentId: createCommentDto.parentCommentId,
                        },
                    },
                }),
            };

            const comment =
                await this.commentRepository.createComment(commentToCreate);

            return {
                commentId: comment.commentId,
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
            const commentUniqueInput: Prisma.CommentWhereUniqueInput = {
                commentId: dto.commentId,
            };

            const comment =
                await this.commentRepository.readComment(commentUniqueInput);

            if (!comment) {
                throw new NotFoundError(
                    `Unable to find comment with id: ${dto.commentId}`
                );
            }

            return {
                commentId: comment.commentId,
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
            const uniquePostInput: Prisma.PostWhereUniqueInput = {
                postId: dto.postId,
            };

            const comments =
                await this.commentRepository.readCommentForPost(
                    uniquePostInput
                );

            if (!comments) {
                throw new Error(
                    `Comments for post with id: ${dto.postId} were not found`
                );
            }

            return comments.map((comment) => {
                return {
                    commentId: comment.commentId,
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
            const uniqueUserInput: Prisma.UserWhereUniqueInput = {
                userId: dto.userId,
            };

            const comments =
                await this.commentRepository.readCommentForUser(
                    uniqueUserInput
                );

            if (!comments) {
                throw new Error(
                    `Comments for user with id: ${dto.userId} were not found`
                );
            }

            return comments.map((comment) => {
                return {
                    commentId: comment.commentId,
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
            const where: Prisma.CommentWhereUniqueInput = {
                commentId: commentIdDto.commentId,
            };

            const data: Prisma.CommentUpdateInput = {
                content: newCommentData.content,
            };

            const updatedComment = await this.commentRepository.updateComment(
                where,
                data
            );

            return {
                commentId: updatedComment.commentId,
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
            const commentUniqueInput: Prisma.CommentWhereUniqueInput = {
                commentId: dto.commentId,
            };

            const deletedComment =
                await this.commentRepository.softDeleteComment(
                    commentUniqueInput
                );

            return {
                commentId: deletedComment.commentId,
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
