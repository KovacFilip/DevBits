import { Prisma } from 'apps/backend/prisma/generated/client';
import {
    LOGGER,
    REPOSITORY_IDENTIFIER,
} from 'apps/backend/src/constants/identifiers';
import { NotFoundError } from 'apps/backend/src/errors/NotFoundError';
import { logServiceErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import { IPostRepository } from 'apps/backend/src/models/interfaces/repositories/IPostRepository';
import { IPostService } from 'apps/backend/src/models/interfaces/services/IPostService';
import { inject, injectable } from 'inversify';
import {
    CreatePostDTO,
    PostIdDTO,
    PostSimpleDTO,
    PostWithContentDTO,
    UpdatePostDTO,
    UserIdDTO,
} from 'packages/shared';
import { Logger } from 'pino';

@injectable()
export class PostService implements IPostService {
    constructor(
        @inject(REPOSITORY_IDENTIFIER.POST_REPOSITORY)
        private readonly postRepository: IPostRepository,
        @inject(LOGGER.LOGGER) private readonly logger: Logger
    ) {}

    async createPost(
        user: UserIdDTO,
        createPost: CreatePostDTO
    ): Promise<PostWithContentDTO> {
        try {
            const postToCreate: Prisma.PostCreateInput = {
                title: createPost.title,
                content: createPost.content,
                user: {
                    connect: {
                        userId: user.userId,
                    },
                },
            };

            const createdPost =
                await this.postRepository.createPost(postToCreate);

            return {
                postId: createdPost.postId,
                title: createdPost.title,
                content: createdPost.content,
                userId: createdPost.userId,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { user, createPost },
                service: 'PostService',
                method: 'createPost',
            });

            throw err;
        }
    }

    async getPostById(dto: PostIdDTO): Promise<PostWithContentDTO> {
        try {
            const uniquePostInput: Prisma.PostWhereUniqueInput = {
                postId: dto.postId,
            };

            const post = await this.postRepository.readPost(uniquePostInput);

            if (!post) {
                throw new NotFoundError(
                    `Unable to find the post with id: ${dto.postId}`
                );
            }

            return {
                postId: post.postId,
                title: post.title,
                content: post.content,
                userId: post.userId,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'PostService',
                method: 'getPostById',
            });

            throw err;
        }
    }

    async getPostsByUser(dto: UserIdDTO): Promise<PostSimpleDTO[]> {
        try {
            const uniqueUserInput: Prisma.UserWhereUniqueInput = {
                userId: dto.userId,
            };

            const posts =
                await this.postRepository.readUsersPosts(uniqueUserInput);

            return posts.map((post) => {
                return {
                    postId: post.postId,
                    userId: post.userId,
                    title: post.title,
                };
            });
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'PostService',
                method: 'getPostsByUser',
            });

            throw err;
        }
    }

    async updatePost(
        postIdDto: PostIdDTO,
        updatePostDto: UpdatePostDTO
    ): Promise<PostWithContentDTO> {
        try {
            const where: Prisma.PostWhereUniqueInput = {
                postId: postIdDto.postId,
            };

            const data: Prisma.PostUpdateInput = {
                title: updatePostDto.title,
                content: updatePostDto.content,
            };

            const updatedPost = await this.postRepository.updatePost(
                where,
                data
            );

            return {
                postId: updatedPost.postId,
                userId: updatedPost.userId,
                title: updatedPost.title,
                content: updatedPost.content,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { postIdDto, updatePostDto },
                service: 'PostService',
                method: 'updatePost',
            });

            throw err;
        }
    }

    async deletePost(dto: PostIdDTO): Promise<PostSimpleDTO> {
        try {
            const uniquePostInput: Prisma.PostWhereUniqueInput = {
                postId: dto.postId,
            };

            const deletedPost =
                await this.postRepository.softDeletePost(uniquePostInput);

            return {
                postId: deletedPost.postId,
                userId: deletedPost.userId,
                title: deletedPost.title,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'PostService',
                method: 'deletePost',
            });

            throw err;
        }
    }
}
