import {
    Comment,
    Prisma,
    PrismaClient,
} from 'apps/backend/prisma/generated/client';
import { DATABASE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { ICommentRepository } from 'apps/backend/src/models/interfaces/repositories/ICommentRepository';
import { inject, injectable } from 'inversify';

@injectable()
export class CommentRepository implements ICommentRepository {
    constructor(
        @inject(DATABASE_IDENTIFIER.PRISMA)
        private readonly prisma: PrismaClient
    ) {}

    createComment(comment: Prisma.CommentCreateInput): Promise<Comment> {
        return this.prisma.comment.create({
            data: comment,
        });
    }

    readComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Comment | null> {
        return this.prisma.comment.findUnique({
            where: {
                ...comment,
                deletedAt: null,
            },
        });
    }

    readCommentForPost(
        post: Prisma.PostWhereUniqueInput
    ): Promise<Comment[] | null> {
        return this.prisma.comment.findMany({
            where: {
                post,
                deletedAt: null,
            },
        });
    }

    readCommentForUser(
        user: Prisma.UserWhereUniqueInput
    ): Promise<Comment[] | null> {
        return this.prisma.comment.findMany({
            where: {
                user,
                deletedAt: null,
            },
        });
    }

    updateComment(
        where: Prisma.CommentWhereUniqueInput,
        data: Prisma.CommentUpdateInput
    ): Promise<Comment> {
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
    }

    hardDeleteComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Comment> {
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
    }

    softDeleteComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Comment> {
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
    }
}
