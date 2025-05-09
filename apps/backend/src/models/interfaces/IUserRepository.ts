import { Prisma, User } from 'apps/backend/prisma/generated/client';

export interface IUserRepository {
    // Create
    createUser(createUser: Prisma.UserCreateInput): Promise<User>;

    // Read
    readUserById(userId: string): Promise<User | null>;
    readUserByProvider(
        providerInfo: Prisma.OAuthAccountProviderProviderUserIdCompoundUniqueInput
    ): Promise<User | null>;

    readUser(user: Prisma.UserWhereUniqueInput): Promise<User | null>;

    // Update
    updateUser(
        where: Prisma.UserWhereUniqueInput,
        data: Prisma.UserUpdateInput
    ): Promise<User>;

    // Delete
    deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User>;
}
