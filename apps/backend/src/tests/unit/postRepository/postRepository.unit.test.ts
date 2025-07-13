import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { pinoLogger } from 'apps/backend/src/logger/pino';
import { IPostRepository } from 'apps/backend/src/models/interfaces/repositories/IPostRepository';
import { PostRepository } from 'apps/backend/src/repositories/PostRepository';
import prisma from 'apps/backend/src/tests/unit/__mocks__/prisma';
import {
    getMockCreateInput,
    getMockPostModel,
    getMockPostWhereUnique,
    getMockPrismaPost,
    getMockUpdateInput,
    getMockUserWhereUnique,
} from 'apps/backend/src/tests/unit/utils/post/repositoryUtils';
import { beforeEach, describe, expect, it } from 'vitest';

describe('PostRepository', () => {
    let postRepository: IPostRepository;

    beforeEach(() => {
        prisma.$transaction.mockImplementation((callback) => callback(prisma));
        postRepository = new PostRepository(prisma, pinoLogger);
    });

    describe('createPost', () => {
        it('creates a new post', async () => {
            const mockCreate = getMockCreateInput();
            const mockPrismaPost = getMockPrismaPost();
            const mockPostModel = getMockPostModel();

            prisma.post.create.mockResolvedValue(mockPrismaPost);

            const result = await postRepository.createPost(mockCreate);

            expect(result).toEqual(mockPostModel);
        });
    });

    describe('readPost', () => {
        it('returns an existing post', async () => {
            const mockPostId = getMockPostWhereUnique();
            const mockPrismaPost = getMockPrismaPost();
            const mockPostModel = getMockPostModel();

            prisma.post.findUnique.mockResolvedValue(mockPrismaPost);

            const result = await postRepository.readPost(mockPostId);

            expect(result).toEqual(mockPostModel);
        });

        it('returns null if post is not existing', async () => {
            const mockPostId = getMockPostWhereUnique();

            prisma.post.findUnique.mockResolvedValue(null);

            const result = await postRepository.readPost(mockPostId);

            expect(result).toBeNull();
        });
    });

    describe('readUsersPosts', () => {
        it('returns users posts', async () => {
            const mockUserId = getMockUserWhereUnique();
            const mockPrismaPost = getMockPrismaPost();
            const posts = [mockPrismaPost];
            const mockPostModel = getMockPostModel();

            prisma.post.findMany.mockResolvedValue(posts);

            const result = await postRepository.readUsersPosts(mockUserId);

            expect(result).toEqual([mockPostModel]);
        });

        it('returns empty list of posts for user who does not have any posts', async () => {
            const mockPostId = getMockUserWhereUnique();

            prisma.post.findMany.mockResolvedValue([]);

            const result = await postRepository.readUsersPosts(mockPostId);

            expect(result).toEqual([]);
        });
    });

    describe('updatePost', () => {
        it('updates existing posts content', async () => {
            const mockPostId = getMockPostWhereUnique();
            const mockUpdate = getMockUpdateInput();
            const mockPrismaPost = getMockPrismaPost();
            const mockPostModel = getMockPostModel();

            prisma.post.findUnique.mockResolvedValue(mockPrismaPost);
            prisma.post.update.mockResolvedValue({
                ...mockPrismaPost,
                content: 'This is changed content',
            });

            const result = await postRepository.updatePost(
                mockPostId,
                mockUpdate
            );

            expect(result).toStrictEqual({
                ...mockPostModel,
                content: 'This is changed content',
            });
        });

        it('throws EntityNotFoundError if post to update does not exist', async () => {
            const mockPostId = getMockPostWhereUnique();

            prisma.post.findUnique.mockResolvedValue(null);

            await expect(
                postRepository.updatePost(mockPostId, {
                    content: 'Updated',
                })
            ).rejects.toThrow(EntityNotFoundError);
            expect(prisma.post.update).not.toHaveBeenCalled();
        });
    });

    describe('hardDeletePost', () => {
        it('deletes an existing post', async () => {
            const mockPostId = getMockPostWhereUnique();
            const mockPrismaPost = getMockPrismaPost();
            const mockPostModel = getMockPostModel();

            prisma.post.findUnique.mockResolvedValue(mockPrismaPost);
            prisma.post.delete.mockResolvedValue(mockPrismaPost);

            const result = await postRepository.hardDeletePost(mockPostId);

            expect(result).toStrictEqual(mockPostModel);
        });

        it('throws EntityNotFoundError when trying to hard delete a non-existent post', async () => {
            const mockPostId = getMockPostWhereUnique();

            prisma.post.findUnique.mockResolvedValue(null);

            await expect(
                postRepository.hardDeletePost(mockPostId)
            ).rejects.toThrow(EntityNotFoundError);

            expect(prisma.post.delete).not.toHaveBeenCalled();
        });
    });

    describe('softDeletePost', () => {
        it('soft deletes an existing post', async () => {
            const mockPostId = getMockPostWhereUnique();
            const now = new Date();

            const mockUndeletedPost = getMockPrismaPost();
            const mockDeletedPost = getMockPrismaPost({ deletedAt: now });

            const mockPostModel = getMockPostModel();

            prisma.post.findUnique.mockResolvedValue(mockUndeletedPost);
            prisma.post.update.mockResolvedValue(mockDeletedPost);

            const result = await postRepository.softDeletePost(mockPostId);

            expect(result).toEqual(mockPostModel);
        });

        it('throws EntityAlreadyDeletedError if post is already soft-deleted', async () => {
            const mockPostId = getMockPostWhereUnique();
            const mockDeletedPost = getMockPrismaPost({
                deletedAt: new Date(),
            });

            prisma.post.findUnique.mockResolvedValue(mockDeletedPost);

            await expect(
                postRepository.softDeletePost(mockPostId)
            ).rejects.toThrow(EntityAlreadyDeletedError);
            expect(prisma.post.update).not.toHaveBeenCalled();
        });

        it('throws EntityNotFoundError if post does not exist', async () => {
            const mockPostId = getMockPostWhereUnique();

            prisma.post.findUnique.mockResolvedValue(null);

            await expect(
                postRepository.softDeletePost(mockPostId)
            ).rejects.toThrow(EntityNotFoundError);

            expect(prisma.post.update).not.toHaveBeenCalled();
        });
    });
});
