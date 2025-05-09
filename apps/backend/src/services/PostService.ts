import { Prisma } from 'apps/backend/prisma/generated/client';
import {
    CreatePostDTO,
    PostIdDTO,
    PostSimpleDTO,
    PostWithContentDTO,
    UpdatePostDTO,
    UserIdDTO,
} from 'packages/shared';
import { NotFoundError } from '../errors/NotFoundError';
import { IPostService } from '../models/interfaces/services/IPostService';
import { PostRepository } from '../repositories/PostRepository';

const postRepository = new PostRepository();

export class PostService implements IPostService {
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

        const createdPost = await postRepository.createPost(postToCreate);

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

        const post = await postRepository.readPost(uniquePostInput);

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

        const posts = await postRepository.readUsersPosts(uniqueUserInput);

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

        const updatedPost = await postRepository.updatePost(where, data);

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
            await postRepository.softDeletePost(uniquePostInput);

        return {
            postId: deletedPost.postId,
            userId: deletedPost.userId,
            title: deletedPost.title,
        };
    }
}
