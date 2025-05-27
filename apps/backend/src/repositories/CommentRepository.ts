import {
    Comment,
    Prisma,
    PrismaClient,
} from 'apps/backend/prisma/generated/client';
import { DATABASE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
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
            where: comment,
        });
    }

    readCommentForPost(
        post: Prisma.PostWhereUniqueInput
    ): Promise<Comment[] | null> {
        return this.prisma.comment.findMany({
            where: {
                post,
            },
        });
    }

    readCommentForUser(
        user: Prisma.UserWhereUniqueInput
    ): Promise<Comment[] | null> {
        return this.prisma.comment.findMany({
            where: {
                user,
            },
        });
    }

    updateComment(
        where: Prisma.CommentWhereUniqueInput,
        data: Prisma.CommentUpdateInput
    ): Promise<Comment> {
        return this.prisma.comment.update({
            where,
            data,
        });
    }

    hardDeleteComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Comment> {
        return this.prisma.comment.delete({
            where: comment,
        });
    }

    softDeleteComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Comment> {
        return this.prisma.comment.update({
            where: comment,
            data: {
                deletedAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }
}
