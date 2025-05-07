import {
    Like,
    Prisma,
    PrismaClient,
} from 'apps/backend/prisma/generated/client';
import { ILikeRepository } from '../models/interfaces/ILikeRepository';

const prisma = new PrismaClient();

export class LikeRepository implements ILikeRepository {
    createLike(like: Prisma.LikeCreateInput): Promise<Like> {
        return prisma.like.create({
            data: like,
        });
    }

    readLike(like: Prisma.LikeWhereUniqueInput): Promise<Like | null> {
        return prisma.like.findUnique({
            where: like,
        });
    }

    updateLike(
        where: Prisma.LikeWhereUniqueInput,
        data: Prisma.LikeUpdateInput
    ): Promise<Like> {
        return prisma.like.update({
            where,
            data,
        });
    }

    hardDeleteLike(like: Prisma.LikeWhereUniqueInput): Promise<Like> {
        return prisma.like.delete({
            where: like,
        });
    }

    softDeleteLike(like: Prisma.LikeWhereUniqueInput): Promise<Like> {
        return prisma.like.update({
            where: like,
            data: {
                deletedAt: Date.now().toString(),
                updatedAt: Date.now().toString(),
            },
        });
    }
}
