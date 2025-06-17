import { Post, Prisma } from 'apps/backend/prisma/generated/client';

export const defaultPostId = '276efe85-a684-4550-94dc-33150c7d173a';
export const defaultUserId = '6a601143-58c9-48b1-bc59-2271e3a6f60c';

export const getMockPost = (overrides: Partial<Post> = {}): Post => ({
    postId: defaultPostId,
    userId: defaultUserId,
    title: 'Default Title',
    content: 'Default Content',
    createdAt: new Date(),
    updatedAt: new Date(),
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
