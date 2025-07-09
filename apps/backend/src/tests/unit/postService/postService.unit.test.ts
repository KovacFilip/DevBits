import { NotFoundError } from 'apps/backend/src/errors/NotFoundError';
import { pinoLogger } from 'apps/backend/src/logger/pino';
import { IPostService } from 'apps/backend/src/models/interfaces/services/IPostService';
import { PostService } from 'apps/backend/src/services/PostService';
import { postRepository } from 'apps/backend/src/tests/unit/__mocks__/postRepository';
import {
    getMockCreatePostDTO,
    getMockPostIdDTO,
    getMockPostSimpleDTO,
    getMockPostWithContentDTO,
    getMockUpdatePostDTO,
    getMockUserIdDTO,
} from 'apps/backend/src/tests/unit/utils/post/dtoUtils';
import { getMockPost } from 'apps/backend/src/tests/unit/utils/post/repositoryUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('PostService', () => {
    let postService: IPostService;

    beforeEach(() => {
        vi.clearAllMocks();
        postService = new PostService(postRepository, pinoLogger);
    });

    describe('createPost', () => {
        it('creates a new post', async () => {
            const userId = getMockUserIdDTO();
            const createPost = getMockCreatePostDTO();
            const post = getMockPost();
            const resultPost = getMockPostWithContentDTO();

            postRepository.createPost.mockResolvedValue(post);

            const result = await postService.createPost(userId, createPost);

            expect(postRepository.createPost).toBeCalledWith({
                ...createPost,
                user: { connect: userId },
            });
            expect(result).toEqual(resultPost);
        });
    });

    describe('getPostById', () => {
        it('returns existing post', async () => {
            const post = getMockPost();
            const postId = getMockPostIdDTO();
            const resultPost = getMockPostWithContentDTO();

            postRepository.readPost.mockResolvedValue(post);

            const result = await postService.getPostById(postId);

            expect(postRepository.readPost).toBeCalledWith(postId);
            expect(result).toEqual(resultPost);
        });

        it('throws NotFoundError if post does not exist', async () => {
            const postWhere = getMockPostIdDTO();

            postRepository.readPost.mockResolvedValue(null);

            await expect(() =>
                postService.getPostById(postWhere)
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe('getPostsByUser', () => {
        it('returns list of user posts', async () => {
            const post = getMockPost();
            const userId = getMockUserIdDTO();
            const postSimple = getMockPostSimpleDTO();

            postRepository.readUsersPosts.mockResolvedValue([post]);

            const result = await postService.getPostsByUser(userId);

            expect(result).toEqual([postSimple]);
        });

        it('returns empty list if user has no posts', async () => {
            const userId = getMockUserIdDTO();

            postRepository.readUsersPosts.mockResolvedValue([]);

            const result = await postService.getPostsByUser(userId);

            expect(result).toEqual([]);
        });
    });

    describe('updatePost', () => {
        it('updates an existing post', async () => {
            const updatePost = getMockUpdatePostDTO();
            const post = getMockPost({ content: updatePost.content });
            const postId = getMockPostIdDTO();
            const resultPost = getMockPostWithContentDTO({
                content: updatePost.content,
            });

            postRepository.updatePost.mockResolvedValue(post);

            const result = await postService.updatePost(postId, updatePost);

            expect(result).toEqual(resultPost);
        });
    });

    describe('deletePost', () => {
        it('soft-deletes the post', async () => {
            const post = getMockPost({ deletedAt: new Date() });
            const postId = getMockPostIdDTO();
            const resultPost = getMockPostSimpleDTO();

            postRepository.softDeletePost.mockResolvedValue(post);

            const result = await postService.deletePost(postId);

            expect(postRepository.softDeletePost).toBeCalledWith(postId);
            expect(postRepository.hardDeletePost).not.toBeCalled();
            expect(result).toEqual(resultPost);
        });
    });
});
