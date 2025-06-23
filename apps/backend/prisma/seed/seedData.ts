import { Prisma } from 'apps/backend/prisma/generated/client';

// Users
export const mikeOxLong: Prisma.UserCreateInput = {
    userId: '11111111-1111-1111-1111-111111111111',
    username: 'Mike Ox-Long',
    email: 'mike@oxlong.com',
    profilePicture: 'https://example.com/mikeoxlong.png',
    accounts: {
        create: [
            {
                id: 'mike-ox-long-id',
                provider: 'google',
                providerUserId: 'google-mike-001',
                expiresAt: new Date('2030-01-01'),
            },
        ],
    },
};

export const benDover: Prisma.UserCreateInput = {
    userId: '22222222-2222-2222-2222-222222222222',
    username: 'Ben Dover',
    email: 'benDover@gmail.com',
    profilePicture: 'https://example.com/ben.png',
    accounts: {
        create: [
            {
                id: 'ben-id',
                provider: 'google',
                providerUserId: 'google-ben-001',
                expiresAt: new Date('2030-01-01'),
            },
        ],
    },
};

// Posts
export const mikesPost: Prisma.PostCreateInput = {
    postId: '76a2ebfe-6513-466d-b73d-68abbaf9cce2',
    title: 'Welcome Post',
    content: 'This is the first post by Mike.',
    user: {
        connect: {
            userId: mikeOxLong.userId,
        },
    },
};
