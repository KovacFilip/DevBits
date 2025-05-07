import { Like, Prisma } from 'apps/backend/prisma/generated/client';

export interface ILikeRepository {
    // Create
    createLike(like: Prisma.LikeCreateInput): Promise<Like>;

    // Read
    readLike(like: Prisma.LikeWhereUniqueInput): Promise<Like | null>;

    // Update
    updateLike(
        where: Prisma.LikeWhereUniqueInput,
        data: Prisma.LikeUpdateInput
    ): Promise<Like>;

    // Delete
    hardDeleteLike(like: Prisma.LikeWhereUniqueInput): Promise<Like>;
    softDeleteLike(like: Prisma.LikeWhereUniqueInput): Promise<Like>;
}
