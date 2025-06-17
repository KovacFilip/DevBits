import { Post, Prisma } from 'apps/backend/prisma/generated/client';
import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { PostRepository } from 'apps/backend/src/repositories/PostRepository';
import prisma from 'apps/backend/src/tests/unit/__mocks__/prisma';
import { beforeEach, describe, expect, it } from 'vitest';

describe('PostRepository', () => {
    let postRepository: PostRepository;

    const examplePost: Post = {
        postId: '276efe85-a684-4550-94dc-33150c7d173a',
        userId: '6a601143-58c9-48b1-bc59-2271e3a6f60c',
        title: 'Testing is amazing',
        content: 'I am using vitest to test stuff',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    };

    beforeEach(() => {
        postRepository = new PostRepository(prisma);
    });

    describe('createPost', () => {
        it('Should create a post', async () => {
            const mockPost: Prisma.PostCreateInput = {
                title: 'Testing is amazing',
                content: 'I am using vitest to test stuff',
                user: {
                    connect: {
                        userId: '6a601143-58c9-48b1-bc59-2271e3a6f60c',
                    },
                },
            };

            prisma.post.create.mockResolvedValue(examplePost);

            const result = await postRepository.createPost(mockPost);

            expect(prisma.post.create).toHaveBeenCalledWith({ data: mockPost });
            expect(result).toBe(examplePost);
        });
    });

    describe('readPost', () => {
        it('Should read an existing post', async () => {
            const existingPostIdInput: Prisma.PostWhereUniqueInput = {
                postId: '276efe85-a684-4550-94dc-33150c7d173a',
            };

            prisma.post.findUnique.mockResolvedValue(examplePost);

            const result = await postRepository.readPost(existingPostIdInput);

            expect(prisma.post.findUnique).toHaveBeenCalledWith({
                where: existingPostIdInput,
            });

            expect(result).toBe(examplePost);
        });

        it('Should return null if post is not existing', async () => {
            const existingPostIdInput: Prisma.PostWhereUniqueInput = {
                postId: '276efe85-a684-4550-94dc-33150c7d173a',
            };

            prisma.post.findUnique.mockResolvedValue(null);

            const result = await postRepository.readPost(existingPostIdInput);

            expect(prisma.post.findUnique).toHaveBeenCalledWith({
                where: existingPostIdInput,
            });

            expect(result).toBe(null);
        });
    });

    describe('readUsersPosts', () => {
        it('Should return users posts', async () => {
            const userInput: Prisma.UserWhereUniqueInput = {
                userId: '6a601143-58c9-48b1-bc59-2271e3a6f60c',
            };

            const posts = [examplePost];

            prisma.post.findMany.mockResolvedValue(posts);

            const result = await postRepository.readUsersPosts(userInput);

            expect(prisma.post.findMany).toHaveBeenCalledWith({
                where: {
                    user: userInput,
                },
            });

            expect(result).toBe(posts);
        });

        it('Should return empty list of posts for user who does not have any posts', async () => {
            const userInput: Prisma.UserWhereUniqueInput = {
                userId: '6a601143-58c9-48b1-bc59-2271e3a6f60c',
            };

            prisma.post.findMany.mockResolvedValue([]);

            const result = await postRepository.readUsersPosts(userInput);

            expect(prisma.post.findMany).toHaveBeenCalledWith({
                where: {
                    user: userInput,
                },
            });

            expect(result).toStrictEqual([]);
        });
    });

    describe('updatePost', () => {
        beforeEach(() => {
            prisma.$transaction.mockImplementationOnce((callback) =>
                callback(prisma)
            );
        });

        it('Should update existing posts content', async () => {
            const uniquePostWhere: Prisma.PostWhereUniqueInput = {
                postId: '6a601143-58c9-48b1-bc59-2271e3a6f60c',
            };

            const newPostContent: Prisma.PostUpdateInput = {
                content: 'This is changed content',
            };

            prisma.post.findUnique.mockResolvedValue(examplePost);
            prisma.post.update.mockResolvedValue({
                ...examplePost,
                content: 'This is changed content',
            });

            const result = await postRepository.updatePost(
                uniquePostWhere,
                newPostContent
            );

            expect(prisma.post.update).toHaveBeenCalledWith({
                where: uniquePostWhere,
                data: newPostContent,
            });

            expect(result).toStrictEqual({
                ...examplePost,
                content: 'This is changed content',
            });
        });

        it('Should throw EntityNotFoundError if post to update does not exist', async () => {
            const uniquePostWhere: Prisma.PostWhereUniqueInput = {
                postId: 'non-existent-id',
            };

            prisma.post.findUnique.mockResolvedValue(null);

            await expect(
                postRepository.updatePost(uniquePostWhere, {
                    content: 'Updated',
                })
            ).rejects.toThrow(
                new EntityNotFoundError('Post', 'non-existent-id')
            );

            expect(prisma.post.update).not.toHaveBeenCalled();
        });
    });

    describe('hardDeletePost', () => {
        beforeEach(() => {
            prisma.$transaction.mockImplementationOnce((callback) =>
                callback(prisma)
            );
        });

        it('Should delete an existing post', async () => {
            const uniquePostWhere: Prisma.PostWhereUniqueInput = {
                postId: '6a601143-58c9-48b1-bc59-2271e3a6f60c',
            };

            prisma.post.findUnique.mockResolvedValue(examplePost);
            prisma.post.delete.mockResolvedValue(examplePost);

            const result = await postRepository.hardDeletePost(uniquePostWhere);

            expect(prisma.post.delete).toHaveBeenCalledWith({
                where: uniquePostWhere,
            });
            expect(result).toStrictEqual(examplePost);
        });

        it('Should throw EntityNotFoundError when trying to hard delete a non-existent post', async () => {
            const uniquePostWhere: Prisma.PostWhereUniqueInput = {
                postId: 'non-existent-id',
            };

            prisma.post.findUnique.mockResolvedValue(null);

            await expect(
                postRepository.hardDeletePost(uniquePostWhere)
            ).rejects.toThrow(EntityNotFoundError);

            expect(prisma.post.delete).not.toHaveBeenCalled();
        });

        it('Should throw EntityNotFoundError when trying to hard delete a non-existent post', async () => {
            const uniquePostWhere: Prisma.PostWhereUniqueInput = {
                postId: 'non-existent-id',
            };

            prisma.post.findUnique.mockResolvedValue(null);

            await expect(
                postRepository.hardDeletePost(uniquePostWhere)
            ).rejects.toThrow(EntityNotFoundError);

            expect(prisma.post.delete).not.toHaveBeenCalled();
        });
    });

    describe('softDeletePost', () => {
        beforeEach(() => {
            prisma.$transaction.mockImplementationOnce((callback) =>
                callback(prisma)
            );
        });

        it('Should soft delete an existing post', async () => {
            const uniquePostWhere: Prisma.PostWhereUniqueInput = {
                postId: '276efe85-a684-4550-94dc-33150c7d173a',
            };

            const now = new Date();
            const softDeletedPost = {
                ...examplePost,
                deletedAt: now,
                updatedAt: now,
            };

            prisma.post.findUnique.mockResolvedValue(examplePost);
            prisma.post.update.mockResolvedValue(softDeletedPost);

            const result = await postRepository.softDeletePost(uniquePostWhere);

            expect(result).toEqual(softDeletedPost);
        });

        it('Should throw EntityAlreadyDeletedError if post is already soft-deleted', async () => {
            const uniquePostWhere: Prisma.PostWhereUniqueInput = {
                postId: '276efe85-a684-4550-94dc-33150c7d173a',
            };

            const alreadyDeletedPost = {
                ...examplePost,
                deletedAt: new Date(),
            };

            prisma.post.findUnique.mockResolvedValue(alreadyDeletedPost);

            await expect(
                postRepository.softDeletePost(uniquePostWhere)
            ).rejects.toThrow(EntityAlreadyDeletedError);

            expect(prisma.post.update).not.toHaveBeenCalled();
        });

        it('Should throw EntityNotFoundError if post does not exist', async () => {
            const uniquePostWhere: Prisma.PostWhereUniqueInput = {
                postId: 'non-existing-post-id',
            };

            prisma.post.findUnique.mockResolvedValue(null);

            await expect(
                postRepository.softDeletePost(uniquePostWhere)
            ).rejects.toThrow(EntityNotFoundError);

            expect(prisma.post.update).not.toHaveBeenCalled();
        });
    });
});
