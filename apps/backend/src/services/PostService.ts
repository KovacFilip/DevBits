import { Prisma } from 'apps/backend/prisma/generated/client';
import { inject, injectable } from 'inversify';
import { REPOSITORY_IDENTIFIER } from '../constants/identifiers';
import { NotFoundError } from '../errors/NotFoundError';
import {
    CreatePostDTO,
    PostIdDTO,
    PostSimpleDTO,
    PostWithContentDTO,
    UpdatePostDTO,
} from '../models/DTOs/PostDTO';
import { UserIdDTO } from '../models/DTOs/UserDTO';
import { IPostRepository } from '../models/interfaces/repositories/IPostRepository';
import { IPostService } from '../models/interfaces/services/IPostService';

@injectable()
export class PostService implements IPostService {
    constructor(
        @inject(REPOSITORY_IDENTIFIER.POST_REPOSITORY)
        private readonly postRepository: IPostRepository
    ) {}

    async createPost(dto: CreatePostDTO): Promise<PostSimpleDTO> {
        const postToCreate: Prisma.PostCreateInput = {
            title: dto.title,
            content: dto.content,
            user: {
                connect: {
                    userId: dto.userId,
                },
            },
        };

        const createdPost = await this.postRepository.createPost(postToCreate);

        return {
            postId: createdPost.postId,
            title: createdPost.title,
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

        if (!posts) {
            throw new NotFoundError(
                `Unable to find posts of user ${dto.userId}`
            );
        }

        return posts.map((post) => {
            return {
                postId: post.postId,
                userId: post.userId,
                title: post.title,
            };
        });
    }

    async updatePost(dto: UpdatePostDTO): Promise<PostWithContentDTO> {
        const where: Prisma.PostWhereUniqueInput = {
            postId: dto.postId,
        };

        const data: Prisma.PostUpdateInput = {
            title: dto.updateData.title,
            content: dto.updateData.content,
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
