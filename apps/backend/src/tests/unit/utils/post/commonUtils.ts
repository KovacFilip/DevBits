import { UserJWTPayload } from 'packages/shared';

export const defaultPostId = '276efe85-a684-4550-94dc-33150c7d173a';

export const defaultUserId = '6a601143-58c9-48b1-bc59-2271e3a6f60c';

export const now = new Date();

export const getDefaultUserJwt = (
    overrides?: Partial<UserJWTPayload>
): UserJWTPayload => {
    return {
        email: 'user@gmail.com',
        name: 'testUser',
        userId: defaultUserId,
        ...overrides,
    };
};
