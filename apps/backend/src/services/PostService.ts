import { Prisma } from 'apps/backend/prisma/generated/client';
import { REPOSITORY_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { NotFoundError } from 'apps/backend/src/errors/NotFoundError';
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

@injectable()
export class PostService implements IPostService {
    constructor(
        @inject(REPOSITORY_IDENTIFIER.POST_REPOSITORY)
        private readonly postRepository: IPostRepository
    ) {}

    async createPost(
        user: UserIdDTO,
        createPost: CreatePostDTO
    ): Promise<PostWithContentDTO> {
        const postToCreate: Prisma.PostCreateInput = {
            title: createPost.title,
            content: createPost.content,
            user: {
                connect: {
                    userId: user.userId,
                },
            },
        };

        const createdPost = await this.postRepository.createPost(postToCreate);

        return {
            postId: createdPost.postId,
            title: createdPost.title,
            content: createdPost.content,
            userId: createdPost.userId,
        };
    }

    async getPostById(dto: PostIdDTO): Promise<PostWithContentDTO> {
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
    }

    async getPostsByUser(dto: UserIdDTO): Promise<PostSimpleDTO[]> {
        const uniqueUserInput: Prisma.UserWhereUniqueInput = {
            userId: dto.userId,
        };

        const posts = await this.postRepository.readUsersPosts(uniqueUserInput);

        return posts.map((post) => {
            return {
                postId: post.postId,
                userId: post.userId,
                title: post.title,
            };
        });
    }

    async updatePost(
        postIdDto: PostIdDTO,
        updatePostDto: UpdatePostDTO
    ): Promise<PostWithContentDTO> {
        const where: Prisma.PostWhereUniqueInput = {
            postId: postIdDto.postId,
        };

        const data: Prisma.PostUpdateInput = {
            title: updatePostDto.title,
            content: updatePostDto.content,
        };

        const updatedPost = await this.postRepository.updatePost(where, data);

        return {
            postId: updatedPost.postId,
            userId: updatedPost.userId,
            title: updatedPost.title,
            content: updatedPost.content,
        };
    }

    async deletePost(dto: PostIdDTO): Promise<PostSimpleDTO> {
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
    }
}
