import { Post } from 'apps/backend/prisma/generated/client';
import {
    CreatePostDTO,
    PostIdDTO,
    PostSimpleDTO,
    PostWithContentDTO,
    UpdatePostDTO,
    UserIdDTO,
} from 'packages/shared';

export const defaultPostId = '276efe85-a684-4550-94dc-33150c7d173a';
export const defaultUserId = '6a601143-58c9-48b1-bc59-2271e3a6f60c';
export const now = new Date();

export const getMockPost = (overrides: Partial<Post> = {}): Post => ({
    postId: defaultPostId,
    userId: defaultUserId,
    title: 'test new post',
    content: 'This is a test new post',
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
});

export const getMockUserIdDTO = (
    userId: string = defaultUserId
): UserIdDTO => ({
    userId,
});

export const getMockPostIdDTO = (
    postId: string = defaultPostId
): PostIdDTO => ({
    postId,
});

export const getMockPostWithContentDTO = (
    overrides: Partial<PostWithContentDTO> = {}
): PostWithContentDTO => ({
    postId: defaultPostId,
    userId: defaultUserId,
    title: 'test new post',
    content: 'This is a test new post',
    ...overrides,
});

export const getMockPostSimpleDTO = (
    overrides: Partial<PostSimpleDTO> = {}
): PostSimpleDTO => ({
    postId: defaultPostId,
    userId: defaultUserId,
    title: 'test new post',
    ...overrides,
});

export const getMockCreatePostDTO = (
    overrides: Partial<CreatePostDTO> = {}
): CreatePostDTO => ({
    title: 'test new post',
    content: 'This is a test new post',
    ...overrides,
});

export const getMockUpdatePostDTO = (
    overrides: Partial<UpdatePostDTO> = {}
): UpdatePostDTO => ({
    content: 'This is an updated content of the post',
    ...overrides,
});
