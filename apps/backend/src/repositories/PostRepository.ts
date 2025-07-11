import {
    Post,
    Prisma,
    PrismaClient,
} from 'apps/backend/prisma/generated/client';
import {
    DATABASE_IDENTIFIER,
    LOGGER,
} from 'apps/backend/src/constants/identifiers';
import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { logRepositoryErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import { IPostRepository } from 'apps/backend/src/models/interfaces/repositories/IPostRepository';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';

@injectable()
export class PostRepository implements IPostRepository {
    constructor(
        @inject(DATABASE_IDENTIFIER.PRISMA)
        private readonly prisma: PrismaClient,
        @inject(LOGGER.LOGGER) private readonly logger: Logger
    ) {}

    async createPost(post: Prisma.PostCreateInput): Promise<Post> {
        try {
            return await this.prisma.post.create({
                data: post,
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'PostRepository',
                method: 'createPost',
                functionInput: { post },
            });

            throw err;
        }
    }

    async readPost(post: Prisma.PostWhereUniqueInput): Promise<Post | null> {
        try {
            return await this.prisma.post.findUnique({
                where: {
                    ...post,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'PostRepository',
                method: 'readPost',
                functionInput: { post },
            });

            throw err;
        }
    }

    async readUsersPosts(user: Prisma.UserWhereUniqueInput): Promise<Post[]> {
        try {
            return await this.prisma.post.findMany({
                where: {
                    user: user,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'PostRepository',
                method: 'readUsersPosts',
                functionInput: { user },
            });

            throw err;
        }
    }

    async updatePost(
        where: Prisma.PostWhereUniqueInput,
        data: Prisma.PostUpdateInput
    ): Promise<Post> {
        try {
            return this.prisma.$transaction(async (tx) => {
                const existingPost = await tx.post.findUnique({
                    where: { ...where, deletedAt: null },
                });

                if (!existingPost) {
                    throw new EntityNotFoundError(
                        'Post',
                        where.postId as string
                    );
                }

                return await tx.post.update({
                    where,
                    data,
                });
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'PostRepository',
                method: 'updatePost',
                functionInput: { where, data },
            });

            throw err;
        }
    }

    async hardDeletePost(post: Prisma.PostWhereUniqueInput): Promise<Post> {
        try {
            return this.prisma.$transaction(async (tx) => {
                const existingPost = await tx.post.findUnique({ where: post });

                if (!existingPost) {
                    throw new EntityNotFoundError(
                        'Post',
                        post.postId as string
                    );
                }

                return await tx.post.delete({
                    where: post,
                });
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'PostRepository',
                method: 'hardDeletePost',
                functionInput: { post },
            });

            throw err;
        }
    }

    async softDeletePost(post: Prisma.PostWhereUniqueInput): Promise<Post> {
        try {
            return this.prisma.$transaction(async (tx) => {
                const existingPost = await tx.post.findUnique({
                    where: post,
                });

                if (!existingPost) {
                    throw new EntityNotFoundError(
                        'Post',
                        post.postId as string
                    );
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
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'PostRepository',
                method: 'softDeletePost',
                functionInput: { post },
            });

            throw err;
        }
    }
}
