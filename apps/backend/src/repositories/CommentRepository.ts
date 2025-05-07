import {
    Comment,
    Prisma,
    PrismaClient,
} from 'apps/backend/prisma/generated/client';
import { ICommentRepository } from '../models/interfaces/ICommentRepository';

const prisma = new PrismaClient();

export class CommentRepository implements ICommentRepository {
    createComment(comment: Prisma.CommentCreateInput): Promise<Comment> {
        return prisma.comment.create({
            data: comment,
        });
    }

    readComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Comment | null> {
        return prisma.comment.findUnique({
            where: comment,
        });
    }

    updateComment(
        where: Prisma.CommentWhereUniqueInput,
        data: Prisma.CommentUpdateInput
    ): Promise<Comment> {
        return prisma.comment.update({
            where,
            data,
        });
    }

    hardDeleteComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Comment> {
        return prisma.comment.delete({
            where: comment,
        });
    }

    softDeleteComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Comment> {
        return prisma.comment.update({
            where: comment,
            data: {
                deletedAt: Date.now().toString(),
                updatedAt: Date.now().toString(),
            },
        });
    }
}
