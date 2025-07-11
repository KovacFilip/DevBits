import {
    Prisma,
    PrismaClient,
    User,
} from 'apps/backend/prisma/generated/client';
import {
    DATABASE_IDENTIFIER,
    LOGGER,
} from 'apps/backend/src/constants/identifiers';
import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { logRepositoryErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import { IUserRepository } from 'apps/backend/src/models/interfaces/repositories/IUserRepository';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';

@injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @inject(DATABASE_IDENTIFIER.PRISMA)
        private readonly prisma: PrismaClient,
        @inject(LOGGER.LOGGER) private readonly logger: Logger
    ) {}

    createUser(createUser: Prisma.UserCreateInput): Promise<User> {
        try {
            return this.prisma.user.create({
                data: createUser,
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'UserRepository',
                method: 'createUser',
                functionInput: { createUser },
            });

            throw err;
        }
    }

    readUser(user: Prisma.UserWhereUniqueInput): Promise<User | null> {
        try {
            return this.prisma.user.findUnique({
                where: {
                    ...user,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'UserRepository',
                method: 'readUser',
                functionInput: { user },
            });

            throw err;
        }
    }

    readUserById(userId: string): Promise<User | null> {
        try {
            return this.prisma.user.findUnique({
                where: {
                    userId: userId,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'UserRepository',
                method: 'readUserById',
                functionInput: { userId },
            });

            throw err;
        }
    }

    async readUserByProvider(
        providerInfo: Prisma.OAuthAccountProviderProviderUserIdCompoundUniqueInput
    ): Promise<User | null> {
        try {
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
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'UserRepository',
                method: 'readUserByProvider',
                functionInput: { providerInfo },
            });

            throw err;
        }
    }

    updateUser(
        where: Prisma.UserWhereUniqueInput,
        data: Prisma.UserUpdateInput
    ): Promise<User> {
        try {
            return this.prisma.$transaction(async (tx) => {
                const user = await tx.user.findUnique({
                    where: { ...where, deletedAt: null },
                });

                if (!user) {
                    throw new EntityNotFoundError(
                        'User',
                        where.userId as string
                    );
                }

                return tx.user.update({
                    where,
                    data,
                });
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'UserRepository',
                method: 'updateUser',
                functionInput: { where, data },
            });

            throw err;
        }
    }

    hardDeleteUser(user: Prisma.UserWhereUniqueInput): Promise<User> {
        try {
            return this.prisma.$transaction(async (tx) => {
                const existingUser = await tx.user.findUnique({ where: user });

                if (!existingUser) {
                    throw new EntityNotFoundError(
                        'User',
                        user.userId as string
                    );
                }

                return tx.user.delete({
                    where: user,
                });
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'UserRepository',
                method: 'hardDeleteUser',
                functionInput: { user },
            });

            throw err;
        }
    }

    softDeleteUser(user: Prisma.UserWhereUniqueInput): Promise<User> {
        try {
            return this.prisma.$transaction(async (tx) => {
                const existingUser = await tx.user.findUnique({ where: user });

                if (!existingUser) {
                    throw new EntityNotFoundError(
                        'User',
                        user.userId as string
                    );
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
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'UserRepository',
                method: 'softDeleteUser',
                functionInput: { user },
            });

            throw err;
        }
    }
}
