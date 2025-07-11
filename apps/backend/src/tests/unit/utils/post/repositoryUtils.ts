import { Post } from 'apps/backend/prisma/generated/client';
import {
    CreatePostModel,
    PostIdModel,
    PostModel,
    UpdatePostModel,
} from 'apps/backend/src/models/models/Post';
import { UserIdModel } from 'apps/backend/src/models/models/User';
import {
    defaultPostId,
    defaultUserId,
    now,
} from 'apps/backend/src/tests/unit/utils/post/commonUtils';

// Repository layer
export const getMockPrismaPost = (overrides: Partial<Post> = {}): Post => ({
    postId: defaultPostId,
    userId: defaultUserId,
    title: 'test new post',
    content: 'This is a test new post',
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
});

export const getMockPostModel = (
    overrides: Partial<PostModel> = {}
): PostModel => ({
    id: defaultPostId,
    userId: defaultUserId,
    title: 'test new post',
    content: 'This is a test new post',
    ...overrides,
});

export const getMockCreateInput = (
    overrides: Partial<CreatePostModel> = {}
): CreatePostModel => ({
    title: 'Default Title',
    content: 'Default Content',
    userId: defaultUserId,
    ...overrides,
});

export const getMockUpdateInput = (
    overrides: UpdatePostModel = {}
): UpdatePostModel => ({
    content: 'Updated Content',
    ...overrides,
});

export const getMockPostWhereUnique = (
    postId: string = defaultPostId
): PostIdModel => postId;

export const getMockUserWhereUnique = (
    userId: string = defaultUserId
): UserIdModel => userId;
