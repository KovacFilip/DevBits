import {
    Post,
    Prisma,
    PrismaClient,
} from 'apps/backend/prisma/generated/client';
import { IPostRepository } from '../models/interfaces/IPostRepository';

const prisma = new PrismaClient();

export class PostRepository implements IPostRepository {
    createPost(post: Prisma.PostCreateInput): Promise<Post> {
        return prisma.post.create({
            data: post,
        });
    }

    readPost(post: Prisma.PostWhereUniqueInput): Promise<Post | null> {
        return prisma.post.findUnique({
            where: post,
        });
    }

    readUsersPosts(user: Prisma.UserWhereUniqueInput): Promise<Post[] | null> {
        return prisma.post.findMany({
            where: {
                user,
            },
        });
    }

    updatePost(
        where: Prisma.PostWhereUniqueInput,
        data: Prisma.PostUpdateInput
    ): Promise<Post> {
        return prisma.post.update({
            where,
            data,
        });
    }

    hardDeletePost(post: Prisma.PostWhereUniqueInput): Promise<Post> {
        return prisma.post.delete({
            where: post,
        });
    }

    softDeletePost(post: Prisma.PostWhereUniqueInput): Promise<Post> {
        return prisma.post.update({
            where: post,
            data: {
                deletedAt: Date.now().toString(),
                updatedAt: Date.now().toString(),
            },
        });
    }
}
