import { User } from 'apps/backend/prisma/generated/client';
import { UserModel } from 'apps/backend/src/models/models/User';

export const mapPrismaUserToUserModel = (prismaUser: User): UserModel => {
    return {
        id: prismaUser.userId,
        email: prismaUser.email ?? undefined,
        username: prismaUser.username ?? undefined,
        profilePicture: prismaUser.profilePicture ?? undefined,
    };
};
