import { Like, Prisma } from 'apps/backend/prisma/generated/client';

export interface ILikeRepository {
    createLike(like: Prisma.LikeCreateInput): Promise<Like>;

    readLike(like: Prisma.LikeWhereUniqueInput): Promise<Like | null>;

    readLikesPerPost(post: Prisma.PostWhereUniqueInput): Promise<Like[]>;

    readNumberOfLikesPerPost(
        post: Prisma.PostWhereUniqueInput
    ): Promise<number>;

    readLikesPerComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Like[]>;

    readNumberOfLikesPerComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<number>;

    readLikesByUser(user: Prisma.UserWhereUniqueInput): Promise<Like[]>;

    updateLike(
        where: Prisma.LikeWhereUniqueInput,
        data: Prisma.LikeUpdateInput
    ): Promise<Like>;

    hardDeleteLike(like: Prisma.LikeWhereUniqueInput): Promise<Like>;
    softDeleteLike(like: Prisma.LikeWhereUniqueInput): Promise<Like>;
}
