import { prisma, Prisma, User } from '@devbits/database';
import { IUserRepository } from '@devbits/shared';

class UserRepository implements IUserRepository {
    createUser(createUser: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({
            data: createUser,
        });
    }

    readUserById(userId: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                userId: userId,
            },
        });
    }

    readUserByUsername(username: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                username: username,
            },
        });
    }

    updateUser(
        where: Prisma.UserWhereUniqueInput,
        data: Prisma.UserUpdateInput
    ): Promise<User> {
        return prisma.user.update({
            where,
            data,
        });
    }

    deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
        return prisma.user.delete({
            where,
        });
    }
}
