import {
    Prisma,
    PrismaClient,
    User,
} from 'apps/backend/prisma/generated/client';
import { IUserRepository } from '../models/interfaces/IUserRepository';

const prisma = new PrismaClient();

export class UserRepository implements IUserRepository {
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
