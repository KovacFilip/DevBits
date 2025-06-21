import {
    defaultPostId,
    defaultUserId,
} from 'apps/backend/src/tests/unit/utils/post/commonUtils';
import {
    CreatePostDTO,
    PostIdDTO,
    PostSimpleDTO,
    PostWithContentDTO,
    UpdatePostDTO,
    UserIdDTO,
} from 'packages/shared';

// DTOs
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
