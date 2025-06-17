import {
    Like,
    Prisma,
    PrismaClient,
} from 'apps/backend/prisma/generated/client';
import { DATABASE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { ILikeRepository } from 'apps/backend/src/models/interfaces/repositories/ILikeRepository';
import { inject, injectable } from 'inversify';

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
            where: {
                ...like,
                deletedAt: null,
            },
        });
    }

    readLikesPerPost(post: Prisma.PostWhereUniqueInput): Promise<Like[]> {
        return this.prisma.like.findMany({
            where: {
                post,
                deletedAt: null,
            },
        });
    }

    readNumberOfLikesPerPost(
        post: Prisma.PostWhereUniqueInput
    ): Promise<number> {
        return this.prisma.like.count({
            where: {
                post,
                deletedAt: null,
            },
        });
    }

    readLikesPerComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Like[]> {
        return this.prisma.like.findMany({
            where: {
                comment,
                deletedAt: null,
            },
        });
    }

    readNumberOfLikesPerComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<number> {
        return this.prisma.like.count({
            where: {
                comment,
                deletedAt: null,
            },
        });
    }

    readLikesByUser(user: Prisma.UserWhereUniqueInput): Promise<Like[]> {
        return this.prisma.like.findMany({
            where: {
                user,
                deletedAt: null,
            },
        });
    }

    updateLike(
        where: Prisma.LikeWhereUniqueInput,
        data: Prisma.LikeUpdateInput
    ): Promise<Like> {
        return this.prisma.$transaction(async (tx) => {
            const existingLike = await tx.like.findUnique({
                where: { ...where, deletedAt: null },
            });

            if (!existingLike) {
                throw new EntityNotFoundError('Like', where.likeId as string);
            }

            return tx.like.update({
                where,
                data,
            });
        });
    }

    hardDeleteLike(like: Prisma.LikeWhereUniqueInput): Promise<Like> {
        return this.prisma.$transaction(async (tx) => {
            const existingLike = await tx.like.findUnique({
                where: { ...like, deletedAt: null },
            });

            if (!existingLike) {
                throw new EntityNotFoundError('Like', like.likeId as string);
            }

            return this.prisma.like.delete({
                where: like,
            });
        });
    }

    softDeleteLike(like: Prisma.LikeWhereUniqueInput): Promise<Like> {
        return this.prisma.$transaction(async (tx) => {
            const existingLike = await tx.like.findUnique({
                where: { ...like, deletedAt: null },
            });

            if (!existingLike) {
                throw new EntityNotFoundError('Like', like.likeId as string);
            }

            if (existingLike.deletedAt !== null) {
                throw new EntityAlreadyDeletedError(
                    'Like',
                    like.likeId as string
                );
            }

            return this.prisma.like.update({
                where: like,
                data: {
                    deletedAt: new Date(),
                    updatedAt: new Date(),
                },
            });
        });
    }
}
