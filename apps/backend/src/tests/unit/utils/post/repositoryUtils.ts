import { Post, Prisma } from 'apps/backend/prisma/generated/client';
import {
    defaultPostId,
    defaultUserId,
    now,
} from 'apps/backend/src/tests/unit/utils/post/commonUtils';

// Repository layer
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

export const getMockCreateInput = (
    overrides: Partial<Prisma.PostCreateInput> = {}
): Prisma.PostCreateInput => ({
    title: 'Default Title',
    content: 'Default Content',
    user: {
        connect: {
            userId: defaultUserId,
        },
    },
    ...overrides,
});

export const getMockUpdateInput = (
    overrides: Partial<Prisma.PostUpdateInput> = {}
): Prisma.PostUpdateInput => ({
    content: 'Updated Content',
    ...overrides,
});

export const getMockPostWhereUnique = (
    postId: string = defaultPostId
): Prisma.PostWhereUniqueInput => ({
    postId,
});

export const getMockUserWhereUnique = (
    userId: string = defaultUserId
): Prisma.UserWhereUniqueInput => ({
    userId,
});
