import {
    Prisma,
    PrismaClient,
    User,
} from 'apps/backend/prisma/generated/client';
import { inject, injectable } from 'inversify';
import { DATABASE_IDENTIFIER } from '../constants/identifiers';
import { IUserRepository } from '../models/interfaces/IUserRepository';

@injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @inject(DATABASE_IDENTIFIER.PRISMA)
        private readonly prisma: PrismaClient
    ) {}

    readUser(user: Prisma.UserWhereUniqueInput): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: user,
        });
    }

    createUser(createUser: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data: createUser,
        });
    }

    readUserById(userId: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                userId: userId,
            },
        });
    }

    async readUserByProvider(
        providerInfo: Prisma.OAuthAccountProviderProviderUserIdCompoundUniqueInput
    ): Promise<User | null> {
        const account = await this.prisma.oAuthAccount.findUnique({
            where: {
                provider_providerUserId: {
                    provider: providerInfo.provider,
                    providerUserId: providerInfo.providerUserId,
                },
            },
            select: { user: true },
        });

        return account?.user || null;
    }

    updateUser(
        where: Prisma.UserWhereUniqueInput,
        data: Prisma.UserUpdateInput
    ): Promise<User> {
        return this.prisma.user.update({
            where,
            data,
        });
    }

    hardDeleteUser(user: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prisma.user.delete({
            where: user,
        });
    }

    softDeleteUser(user: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prisma.user.update({
            data: {
                updatedAt: new Date(),
                deletedAt: new Date(),
            },
            where: user,
        });
    }
}
