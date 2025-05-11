import {
    Post,
    Prisma,
    PrismaClient,
} from 'apps/backend/prisma/generated/client';
import { inject, injectable } from 'inversify';
import { DATABASE_IDENTIFIER } from '../constants/identifiers';
import { IPostRepository } from '../models/interfaces/IPostRepository';

@injectable()
export class PostRepository implements IPostRepository {
    constructor(
        @inject(DATABASE_IDENTIFIER.PRISMA)
        private readonly prisma: PrismaClient
    ) {}

    createPost(post: Prisma.PostCreateInput): Promise<Post> {
        return this.prisma.post.create({
            data: post,
        });
    }

    readPost(post: Prisma.PostWhereUniqueInput): Promise<Post | null> {
        return this.prisma.post.findUnique({
            where: post,
        });
    }

    readUsersPosts(user: Prisma.UserWhereUniqueInput): Promise<Post[] | null> {
        return this.prisma.post.findMany({
            where: {
                user,
            },
        });
    }

    updatePost(
        where: Prisma.PostWhereUniqueInput,
        data: Prisma.PostUpdateInput
    ): Promise<Post> {
        return this.prisma.post.update({
            where,
            data,
        });
    }

    hardDeletePost(post: Prisma.PostWhereUniqueInput): Promise<Post> {
        return this.prisma.post.delete({
            where: post,
        });
    }

    softDeletePost(post: Prisma.PostWhereUniqueInput): Promise<Post> {
        return this.prisma.post.update({
            where: post,
            data: {
                deletedAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }
}
