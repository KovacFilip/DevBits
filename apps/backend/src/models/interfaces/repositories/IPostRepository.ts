import { Post, Prisma } from 'apps/backend/prisma/generated/client';

export interface IPostRepository {
    // Create
    createPost(post: Prisma.PostCreateInput): Promise<Post>;

    // Read
    readPost(post: Prisma.PostWhereUniqueInput): Promise<Post | null>;
    readUsersPosts(user: Prisma.UserWhereUniqueInput): Promise<Post[] | null>;

    // Update
    updatePost(
        where: Prisma.PostWhereUniqueInput,
        data: Prisma.PostUpdateInput
    ): Promise<Post>;

    // Delete
    hardDeletePost(post: Prisma.PostWhereUniqueInput): Promise<Post>;
    softDeletePost(post: Prisma.PostWhereUniqueInput): Promise<Post>;
}
