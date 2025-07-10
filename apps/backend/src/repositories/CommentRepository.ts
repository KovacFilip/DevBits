import {
    Comment,
    Prisma,
    PrismaClient,
} from 'apps/backend/prisma/generated/client';
import {
    DATABASE_IDENTIFIER,
    LOGGER,
} from 'apps/backend/src/constants/identifiers';
import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { logRepositoryErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import { ICommentRepository } from 'apps/backend/src/models/interfaces/repositories/ICommentRepository';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';

@injectable()
export class CommentRepository implements ICommentRepository {
    constructor(
        @inject(DATABASE_IDENTIFIER.PRISMA)
        private readonly prisma: PrismaClient,
        @inject(LOGGER.LOGGER) private readonly logger: Logger
    ) {}

    createComment(comment: Prisma.CommentCreateInput): Promise<Comment> {
        try {
            return this.prisma.comment.create({
                data: comment,
            });
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

    readComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Comment | null> {
        try {
            return this.prisma.comment.findUnique({
                where: {
                    ...comment,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'CommentRepository',
                method: 'readComment',
                functionInput: { comment },
            });

            throw err;
        }
    }

    readCommentForPost(
        post: Prisma.PostWhereUniqueInput
    ): Promise<Comment[] | null> {
        try {
            return this.prisma.comment.findMany({
                where: {
                    post,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'CommentRepository',
                method: 'readCommentForPost',
                functionInput: { post },
            });

            throw err;
        }
    }

    readCommentForUser(
        user: Prisma.UserWhereUniqueInput
    ): Promise<Comment[] | null> {
        try {
            return this.prisma.comment.findMany({
                where: {
                    user,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'CommentRepository',
                method: 'readCommentForUser',
                functionInput: { user },
            });

            throw err;
        }
    }

    updateComment(
        where: Prisma.CommentWhereUniqueInput,
        data: Prisma.CommentUpdateInput
    ): Promise<Comment> {
        try {
            return this.prisma.$transaction(async (tx) => {
                const existingComment = await tx.comment.findUnique({
                    where: { ...where, deletedAt: null },
                });

                if (!existingComment) {
                    throw new EntityNotFoundError(
                        'Comment',
                        where.commentId as string
                    );
                }

                return tx.comment.update({
                    where,
                    data,
                });
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'CommentRepository',
                method: 'readCommentForUser',
                functionInput: { where, data },
            });

            throw err;
        }
    }

    hardDeleteComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Comment> {
        try {
            return this.prisma.$transaction(async (tx) => {
                const existingComment = await tx.comment.findUnique({
                    where: comment,
                });

                if (!existingComment) {
                    throw new EntityAlreadyDeletedError(
                        'Comment',
                        comment.commentId as string
                    );
                }

                return tx.comment.delete({
                    where: comment,
                });
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'CommentRepository',
                method: 'hardDeleteComment',
                functionInput: { comment },
            });

            throw err;
        }
    }

    softDeleteComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Comment> {
        try {
            return this.prisma.$transaction(async (tx) => {
                const existingComment = await tx.comment.findUnique({
                    where: comment,
                });

                if (!existingComment) {
                    throw new EntityNotFoundError(
                        'Comment',
                        comment.commentId as string
                    );
                }

                if (existingComment.deletedAt !== null) {
                    throw new EntityAlreadyDeletedError(
                        'Comment',
                        comment.commentId as string
                    );
                }

                return tx.comment.update({
                    where: comment,
                    data: {
                        deletedAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'CommentRepository',
                method: 'softDeleteComment',
                functionInput: { comment },
            });

            throw err;
        }
    }
}
