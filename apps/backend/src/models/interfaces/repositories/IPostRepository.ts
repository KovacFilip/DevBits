import { Post, Prisma } from 'apps/backend/prisma/generated/client';

export interface IPostRepository {
    createPost(post: Prisma.PostCreateInput): Promise<Post>;

    readPost(post: Prisma.PostWhereUniqueInput): Promise<Post | null>;
    readUsersPosts(user: Prisma.UserWhereUniqueInput): Promise<Post[]>;

    updatePost(
        where: Prisma.PostWhereUniqueInput,
        data: Prisma.PostUpdateInput
    ): Promise<Post>;

    hardDeletePost(post: Prisma.PostWhereUniqueInput): Promise<Post>;
    softDeletePost(post: Prisma.PostWhereUniqueInput): Promise<Post>;
}
