import {
    Prisma,
    PrismaClient,
    User,
} from 'apps/backend/prisma/generated/client';
import { DATABASE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { IUserRepository } from 'apps/backend/src/models/interfaces/repositories/IUserRepository';
import { inject, injectable } from 'inversify';

@injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @inject(DATABASE_IDENTIFIER.PRISMA)
        private readonly prisma: PrismaClient
    ) {}

    createUser(createUser: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data: createUser,
        });
    }

    readUser(user: Prisma.UserWhereUniqueInput): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                ...user,
                deletedAt: null,
            },
        });
    }

    readUserById(userId: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                userId: userId,
                deletedAt: null,
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
                user: {
                    deletedAt: null,
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
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { ...where, deletedAt: null },
            });

            if (!user) {
                throw new EntityNotFoundError('User', where.userId as string);
            }

            return tx.user.update({
                where,
                data,
            });
        });
    }

    hardDeleteUser(user: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prisma.$transaction(async (tx) => {
            const existingUser = await tx.user.findUnique({ where: user });

            if (!existingUser) {
                throw new EntityNotFoundError('User', user.userId as string);
            }

            return tx.user.delete({
                where: user,
            });
        });
    }

    softDeleteUser(user: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prisma.$transaction(async (tx) => {
            const existingUser = await tx.user.findUnique({ where: user });

            if (!existingUser) {
                throw new EntityNotFoundError('User', user.userId as string);
            }

            if (existingUser.deletedAt !== null) {
                throw new EntityAlreadyDeletedError(
                    'User',
                    user.userId as string
                );
            }

            return tx.user.update({
                data: {
                    updatedAt: new Date(),
                    deletedAt: new Date(),
                },
                where: user,
            });
        });
    }
}
