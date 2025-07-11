import { Prisma, PrismaClient } from 'apps/backend/prisma/generated/client';
import {
    DATABASE_IDENTIFIER,
    LOGGER,
} from 'apps/backend/src/constants/identifiers';
import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { logRepositoryErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import { mapPrismaPostToPostModel } from 'apps/backend/src/mappers/prismaToModels/Post';
import { IPostRepository } from 'apps/backend/src/models/interfaces/repositories/IPostRepository';
import {
    CreatePostModel,
    PostIdModel,
    PostModel,
    UpdatePostModel,
} from 'apps/backend/src/models/models/Post';
import { UserIdModel } from 'apps/backend/src/models/models/User';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';

@injectable()
export class PostRepository implements IPostRepository {
    constructor(
        @inject(DATABASE_IDENTIFIER.PRISMA)
        private readonly prisma: PrismaClient,
        @inject(LOGGER.LOGGER) private readonly logger: Logger
    ) {}

    async createPost(post: CreatePostModel): Promise<PostModel> {
        try {
            const postToCreate: Prisma.PostCreateInput = {
                title: post.title,
                content: post.content,
                user: {
                    connect: {
                        userId: post.userId,
                    },
                },
            };

            const result = await this.prisma.post.create({
                data: postToCreate,
            });

            return {
                id: result.postId,
                title: result.title,
                content: result.content,
                userId: result.userId,
            };
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'PostRepository',
                method: 'createPost',
                functionInput: { newPost: post },
            });

            throw err;
        }
    }

    async readPost(postId: PostIdModel): Promise<PostModel | null> {
        try {
            const prismaPostInput: Prisma.PostWhereUniqueInput = {
                postId: postId,
                deletedAt: null,
            };

            const result = await this.prisma.post.findUnique({
                where: prismaPostInput,
            });

            if (!result) {
                return null;
            }

            return mapPrismaPostToPostModel(result);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'PostRepository',
                method: 'readPost',
                functionInput: { post: postId },
            });

            throw err;
        }
    }

    async readUsersPosts(userId: UserIdModel): Promise<PostModel[]> {
        try {
            const prismaUserInput: Prisma.UserWhereUniqueInput = {
                userId: userId,
            };

            const result = await this.prisma.post.findMany({
                where: {
                    user: prismaUserInput,
                    deletedAt: null,
                },
            });

            return result.map((post) => mapPrismaPostToPostModel(post));
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'PostRepository',
                method: 'readUsersPosts',
                functionInput: { user: userId },
            });

            throw err;
        }
    }

    async updatePost(
        postId: PostIdModel,
        data: UpdatePostModel
    ): Promise<PostModel> {
        try {
            const prismaPostWhere: Prisma.PostWhereUniqueInput = {
                postId,
                deletedAt: null,
            };

            const prismaNewPostData: Prisma.PostUpdateInput = {
                ...data,
            };

            const result = await this.prisma.$transaction(async (tx) => {
                const existingPost = await tx.post.findUnique({
                    where: { ...prismaPostWhere },
                });

                if (!existingPost) {
                    throw new EntityNotFoundError('Post', postId);
                }

                return await tx.post.update({
                    where: prismaPostWhere,
                    data: prismaNewPostData,
                });
            });

            return mapPrismaPostToPostModel(result);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'PostRepository',
                method: 'updatePost',
                functionInput: { where: postId, data },
            });

            throw err;
        }
    }

    async hardDeletePost(postId: PostIdModel): Promise<PostModel> {
        try {
            const prismaPostWhere: Prisma.PostWhereUniqueInput = {
                postId,
            };

            const result = await this.prisma.$transaction(async (tx) => {
                const existingPost = await tx.post.findUnique({
                    where: prismaPostWhere,
                });

                if (!existingPost) {
                    throw new EntityNotFoundError('Post', postId);
                }

                return await tx.post.delete({
                    where: prismaPostWhere,
                });
            });

            return mapPrismaPostToPostModel(result);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'PostRepository',
                method: 'hardDeletePost',
                functionInput: { postId },
            });

            throw err;
        }
    }

    async softDeletePost(postId: PostIdModel): Promise<PostModel> {
        try {
            const prismaPostWhere: Prisma.PostWhereUniqueInput = {
                postId,
            };

            const result = await this.prisma.$transaction(async (tx) => {
                const existingPost = await tx.post.findUnique({
                    where: prismaPostWhere,
                });

                if (!existingPost) {
                    throw new EntityNotFoundError('Post', postId as string);
                }

                if (existingPost.deletedAt !== null) {
                    throw new EntityAlreadyDeletedError(
                        'Post',
                        postId as string
                    );
                }

                return tx.post.update({
                    where: prismaPostWhere,
                    data: {
                        deletedAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
            });

            return mapPrismaPostToPostModel(result);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'PostRepository',
                method: 'softDeletePost',
                functionInput: { postId },
            });

            throw err;
        }
    }
}
