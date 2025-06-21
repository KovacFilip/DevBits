import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { IPostRepository } from 'apps/backend/src/models/interfaces/repositories/IPostRepository';
import { PostRepository } from 'apps/backend/src/repositories/PostRepository';
import prisma from 'apps/backend/src/tests/unit/__mocks__/prisma';
import {
    getMockCreateInput,
    getMockPost,
    getMockPostWhereUnique,
    getMockUpdateInput,
    getMockUserWhereUnique,
} from 'apps/backend/src/tests/unit/utils/post/repositoryUtils';
import { beforeEach, describe, expect, it } from 'vitest';

describe('PostRepository', () => {
    let postRepository: IPostRepository;

    beforeEach(() => {
        prisma.$transaction.mockImplementation((callback) => callback(prisma));
        postRepository = new PostRepository(prisma);
    });

    describe('createPost', () => {
        it('creates a new post', async () => {
            const mockCreate = getMockCreateInput();
            const mockPost = getMockPost();

            prisma.post.create.mockResolvedValue(mockPost);

            const result = await postRepository.createPost(mockCreate);

            expect(prisma.post.create).toHaveBeenCalledWith({
                data: mockCreate,
            });
            expect(result).toEqual(mockPost);
        });
    });

    describe('readPost', () => {
        it('returns an existing post', async () => {
            const mockWhere = getMockPostWhereUnique();
            const mockPost = getMockPost();

            prisma.post.findUnique.mockResolvedValue(mockPost);

            const result = await postRepository.readPost(mockWhere);

            expect(prisma.post.findUnique).toHaveBeenCalledWith({
                where: {
                    ...mockWhere,
                    deletedAt: null,
                },
            });

            expect(result).toEqual(mockPost);
        });

        it('returns null if post is not existing', async () => {
            const mockWhere = getMockPostWhereUnique();

            prisma.post.findUnique.mockResolvedValue(null);

            const result = await postRepository.readPost(mockWhere);

            expect(prisma.post.findUnique).toHaveBeenCalledWith({
                where: {
                    ...mockWhere,
                    deletedAt: null,
                },
            });
            expect(result).toBeNull();
        });
    });

    describe('readUsersPosts', () => {
        it('returns users posts', async () => {
            const mockWhere = getMockUserWhereUnique();
            const mockPost = getMockPost();
            const posts = [mockPost];

            prisma.post.findMany.mockResolvedValue(posts);

            const result = await postRepository.readUsersPosts(mockWhere);

            expect(prisma.post.findMany).toHaveBeenCalledWith({
                where: {
                    user: mockWhere,
                    deletedAt: null,
                },
            });
            expect(result).toEqual(posts);
        });

        it('returns empty list of posts for user who does not have any posts', async () => {
            const mockWhere = getMockUserWhereUnique();

            prisma.post.findMany.mockResolvedValue([]);

            const result = await postRepository.readUsersPosts(mockWhere);

            expect(prisma.post.findMany).toHaveBeenCalledWith({
                where: {
                    user: mockWhere,
                    deletedAt: null,
                },
            });
            expect(result).toEqual([]);
        });
    });

    describe('updatePost', () => {
        it('updates existing posts content', async () => {
            const mockWhere = getMockPostWhereUnique();
            const mockUpdate = getMockUpdateInput();
            const mockPost = getMockPost();

            prisma.post.findUnique.mockResolvedValue(mockPost);
            prisma.post.update.mockResolvedValue({
                ...mockPost,
                content: 'This is changed content',
            });

            const result = await postRepository.updatePost(
                mockWhere,
                mockUpdate
            );

            expect(prisma.post.update).toHaveBeenCalledWith({
                where: mockWhere,
                data: mockUpdate,
            });
            expect(result).toStrictEqual({
                ...mockPost,
                content: 'This is changed content',
            });
        });

        it('throws EntityNotFoundError if post to update does not exist', async () => {
            const mockWhere = getMockPostWhereUnique();

            prisma.post.findUnique.mockResolvedValue(null);

            await expect(
                postRepository.updatePost(mockWhere, {
                    content: 'Updated',
                })
            ).rejects.toThrow(EntityNotFoundError);
            expect(prisma.post.update).not.toHaveBeenCalled();
        });
    });

    describe('hardDeletePost', () => {
        it('deletes an existing post', async () => {
            const mockWhere = getMockPostWhereUnique();
            const mockPost = getMockPost();

            prisma.post.findUnique.mockResolvedValue(mockPost);
            prisma.post.delete.mockResolvedValue(mockPost);

            const result = await postRepository.hardDeletePost(mockWhere);

            expect(prisma.post.delete).toHaveBeenCalledWith({
                where: mockWhere,
            });
            expect(result).toStrictEqual(mockPost);
        });

        it('throws EntityNotFoundError when trying to hard delete a non-existent post', async () => {
            const mockWhere = getMockPostWhereUnique();

            prisma.post.findUnique.mockResolvedValue(null);

            await expect(
                postRepository.hardDeletePost(mockWhere)
            ).rejects.toThrow(EntityNotFoundError);

            expect(prisma.post.delete).not.toHaveBeenCalled();
        });
    });

    describe('softDeletePost', () => {
        it('soft deletes an existing post', async () => {
            const mockWhere = getMockPostWhereUnique();
            const now = new Date();

            const mockUndeletedPost = getMockPost();
            const mockDeletedPost = getMockPost({ deletedAt: now });

            prisma.post.findUnique.mockResolvedValue(mockUndeletedPost);
            prisma.post.update.mockResolvedValue(mockDeletedPost);

            const result = await postRepository.softDeletePost(mockWhere);

            expect(result).toEqual(mockDeletedPost);
        });

        it('throws EntityAlreadyDeletedError if post is already soft-deleted', async () => {
            const mockWhere = getMockPostWhereUnique();
            const mockDeletedPost = getMockPost({ deletedAt: new Date() });

            prisma.post.findUnique.mockResolvedValue(mockDeletedPost);

            await expect(
                postRepository.softDeletePost(mockWhere)
            ).rejects.toThrow(EntityAlreadyDeletedError);
            expect(prisma.post.update).not.toHaveBeenCalled();
        });

        it('throws EntityNotFoundError if post does not exist', async () => {
            const mockWhere = getMockPostWhereUnique();

            prisma.post.findUnique.mockResolvedValue(null);

            await expect(
                postRepository.softDeletePost(mockWhere)
            ).rejects.toThrow(EntityNotFoundError);

            expect(prisma.post.update).not.toHaveBeenCalled();
        });
    });
});
