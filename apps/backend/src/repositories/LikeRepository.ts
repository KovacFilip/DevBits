import {
    Like,
    Prisma,
    PrismaClient,
} from 'apps/backend/prisma/generated/client';
import { inject, injectable } from 'inversify';
import { DATABASE_IDENTIFIER } from '../constants/identifiers';
import { ILikeRepository } from '../models/interfaces/ILikeRepository';

@injectable()
export class LikeRepository implements ILikeRepository {
    constructor(
        @inject(DATABASE_IDENTIFIER.PRISMA)
        private readonly prisma: PrismaClient
    ) {}

    createLike(like: Prisma.LikeCreateInput): Promise<Like> {
        return this.prisma.like.create({
            data: like,
        });
    }

    readLike(like: Prisma.LikeWhereUniqueInput): Promise<Like | null> {
        return this.prisma.like.findUnique({
            where: like,
        });
    }

    readLikesPerPost(post: Prisma.PostWhereUniqueInput): Promise<Like[]> {
        return this.prisma.like.findMany({
            where: {
                post,
            },
        });
    }

    readNumberOfLikesPerPost(
        post: Prisma.PostWhereUniqueInput
    ): Promise<number> {
        return this.prisma.like.count({
            where: {
                post,
            },
        });
    }

    readLikesPerComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Like[]> {
        return this.prisma.like.findMany({
            where: {
                comment,
            },
        });
    }

    readNumberOfLikesPerComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<number> {
        return this.prisma.like.count({
            where: {
                comment,
            },
        });
    }

    readLikesByUser(user: Prisma.UserWhereUniqueInput): Promise<Like[]> {
        return this.prisma.like.findMany({
            where: {
                user,
            },
        });
    }

    updateLike(
        where: Prisma.LikeWhereUniqueInput,
        data: Prisma.LikeUpdateInput
    ): Promise<Like> {
        return this.prisma.like.update({
            where,
            data,
        });
    }

    hardDeleteLike(like: Prisma.LikeWhereUniqueInput): Promise<Like> {
        return this.prisma.like.delete({
            where: like,
        });
    }

    softDeleteLike(like: Prisma.LikeWhereUniqueInput): Promise<Like> {
        return this.prisma.like.update({
            where: like,
            data: {
                deletedAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }
}
