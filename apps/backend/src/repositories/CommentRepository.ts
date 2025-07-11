import { Prisma, PrismaClient } from 'apps/backend/prisma/generated/client';
import {
    DATABASE_IDENTIFIER,
    LOGGER,
} from 'apps/backend/src/constants/identifiers';
import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { logRepositoryErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import { mapPrismaCommentToCommentModel } from 'apps/backend/src/mappers/prismaToModels/Comment';
import { ICommentRepository } from 'apps/backend/src/models/interfaces/repositories/ICommentRepository';
import {
    CommentIdModel,
    CommentModel,
    CreateCommentModel,
    UpdateCommentModel,
} from 'apps/backend/src/models/models/Comment';
import { PostIdModel } from 'apps/backend/src/models/models/Post';
import { UserIdModel } from 'apps/backend/src/models/models/User';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';

@injectable()
export class CommentRepository implements ICommentRepository {
    constructor(
        @inject(DATABASE_IDENTIFIER.PRISMA)
        private readonly prisma: PrismaClient,
        @inject(LOGGER.LOGGER) private readonly logger: Logger
    ) {}

    async createComment(comment: CreateCommentModel): Promise<CommentModel> {
        try {
            const commentToCreate: Prisma.CommentCreateInput = {
                user: { connect: { userId: comment.userId } },
                post: { connect: { postId: comment.postId } },
                content: comment.content,
                ...(comment.parentCommentId && {
                    parentComment: {
                        connect: {
                            commentId: comment.parentCommentId,
                        },
                    },
                }),
            };

            const result = await this.prisma.comment.create({
                data: commentToCreate,
            });

            return mapPrismaCommentToCommentModel(result);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'CommentRepository',
                method: 'createComment',
                functionInput: { comment },
            });

            throw err;
        }
    }

    async readComment(commentId: CommentIdModel): Promise<CommentModel | null> {
        try {
            const prismaCommentWhere: Prisma.CommentWhereUniqueInput = {
                commentId,
                deletedAt: null,
            };

            const result = await this.prisma.comment.findUnique({
                where: prismaCommentWhere,
            });

            if (!result) {
                return null;
            }

            return mapPrismaCommentToCommentModel(result);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'CommentRepository',
                method: 'readComment',
                functionInput: { commentId },
            });

            throw err;
        }
    }

    async readCommentForPost(
        postId: PostIdModel
    ): Promise<CommentModel[] | null> {
        try {
            const result = await this.prisma.comment.findMany({
                where: {
                    postId,
                    deletedAt: null,
                },
            });

            return result.map((comment) =>
                mapPrismaCommentToCommentModel(comment)
            );
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'CommentRepository',
                method: 'readCommentForPost',
                functionInput: { postId },
            });

            throw err;
        }
    }

    async readCommentForUser(
        // user: Prisma.UserWhereUniqueInput
        userId: UserIdModel
    ): Promise<CommentModel[] | null> {
        try {
            const result = await this.prisma.comment.findMany({
                where: {
                    userId,
                    deletedAt: null,
                },
            });

            return result.map((comment) =>
                mapPrismaCommentToCommentModel(comment)
            );
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'CommentRepository',
                method: 'readCommentForUser',
                functionInput: { userId },
            });

            throw err;
        }
    }

    async updateComment(
        commentId: CommentIdModel,
        data: UpdateCommentModel
    ): Promise<CommentModel> {
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                const existingComment = await tx.comment.findUnique({
                    where: { commentId, deletedAt: null },
                });

                if (!existingComment) {
                    throw new EntityNotFoundError('Comment', commentId);
                }

                return tx.comment.update({
                    where: {
                        commentId,
                    },
                    data,
                });
            });

            return mapPrismaCommentToCommentModel(result);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'CommentRepository',
                method: 'readCommentForUser',
                functionInput: { commentId, data },
            });

            throw err;
        }
    }

    async hardDeleteComment(commentId: CommentIdModel): Promise<CommentModel> {
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                const existingComment = await tx.comment.findUnique({
                    where: {
                        commentId,
                    },
                });

                if (!existingComment) {
                    throw new EntityAlreadyDeletedError('Comment', commentId);
                }

                return tx.comment.delete({
                    where: {
                        commentId,
                    },
                });
            });

            return mapPrismaCommentToCommentModel(result);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'CommentRepository',
                method: 'hardDeleteComment',
                functionInput: { commentId },
            });

            throw err;
        }
    }

    async softDeleteComment(commentId: CommentIdModel): Promise<CommentModel> {
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                const existingComment = await tx.comment.findUnique({
                    where: {
                        commentId,
                    },
                });

                if (!existingComment) {
                    throw new EntityNotFoundError('Comment', commentId);
                }

                if (existingComment.deletedAt !== null) {
                    throw new EntityAlreadyDeletedError('Comment', commentId);
                }

                return tx.comment.update({
                    where: {
                        commentId,
                    },
                    data: {
                        deletedAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
            });

            return mapPrismaCommentToCommentModel(result);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'CommentRepository',
                method: 'softDeleteComment',
                functionInput: { commentId },
            });

            throw err;
        }
    }
}
