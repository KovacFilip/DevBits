import { Prisma, User } from '@devbits/database';

export interface IUserRepository {
    // Create
    createUser(createUser: Prisma.UserCreateInput): Promise<User>;

    // Read
    readUserById(userId: string): Promise<User | null>;
    readUserByUsername(username: string): Promise<User | null>;

    // Update
    updateUser(
        where: Prisma.UserWhereUniqueInput,
        data: Prisma.UserUpdateInput
    ): Promise<User>;

    // Delete
    deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User>;
}
