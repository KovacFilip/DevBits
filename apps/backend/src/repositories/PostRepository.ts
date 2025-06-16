import {
    Post,
    Prisma,
    PrismaClient,
} from 'apps/backend/prisma/generated/client';
import { DATABASE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { IPostRepository } from 'apps/backend/src/models/interfaces/repositories/IPostRepository';
import { inject, injectable } from 'inversify';

@injectable()
export class PostRepository implements IPostRepository {
    constructor(
        @inject(DATABASE_IDENTIFIER.PRISMA)
        private readonly prisma: PrismaClient
    ) {}

    async createPost(post: Prisma.PostCreateInput): Promise<Post> {
        return this.prisma.post.create({
            data: post,
        });
    }

    async readPost(post: Prisma.PostWhereUniqueInput): Promise<Post | null> {
        return this.prisma.post.findUnique({
            where: post,
        });
    }

    async readUsersPosts(user: Prisma.UserWhereUniqueInput): Promise<Post[]> {
        return this.prisma.post.findMany({
            where: {
                user,
            },
        });
    }

    async updatePost(
        where: Prisma.PostWhereUniqueInput,
        data: Prisma.PostUpdateInput
    ): Promise<Post> {
        const existingPost = await this.prisma.post.findUnique({ where });

        if (!existingPost) {
            throw new EntityNotFoundError('Post', where.postId as string);
        }

        return this.prisma.post.update({
            where,
            data,
        });
    }

    async hardDeletePost(post: Prisma.PostWhereUniqueInput): Promise<Post> {
        const existingPost = await this.prisma.post.findUnique({ where: post });

        if (!existingPost) {
            throw new EntityNotFoundError('Post', post.postId as string);
        }

        return this.prisma.post.delete({
            where: post,
        });
    }

    async softDeletePost(post: Prisma.PostWhereUniqueInput): Promise<Post> {
        return this.prisma.$transaction(async (tx) => {
            const existingPost = await tx.post.findUnique({
                where: post,
            });

            if (!existingPost) {
                throw new EntityNotFoundError('Post', post.postId as string);
            }

            if (existingPost.deletedAt !== null) {
                throw new EntityAlreadyDeletedError(
                    'Post',
                    post.postId as string
                );
            }

            return tx.post.update({
                where: post,
                data: {
                    deletedAt: new Date(),
                    updatedAt: new Date(),
                },
            });
        });
    }
}
