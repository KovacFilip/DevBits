import { PrismaClient } from 'apps/backend/prisma/generated/client';
import {
    DATABASE_IDENTIFIER,
    LOGGER,
} from 'apps/backend/src/constants/identifiers';
import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { logRepositoryErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import { mapPrismaUserToUserModel } from 'apps/backend/src/mappers/prismaToModels/User';
import { IUserRepository } from 'apps/backend/src/models/interfaces/repositories/IUserRepository';
import {
    CreateUserModel,
    OAuthAccountModel,
    UpdateUserModel,
    UserIdModel,
    UserModel,
} from 'apps/backend/src/models/models/User';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';

@injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @inject(DATABASE_IDENTIFIER.PRISMA)
        private readonly prisma: PrismaClient,
        @inject(LOGGER.LOGGER) private readonly logger: Logger
    ) {}

    async createUser(createUser: CreateUserModel): Promise<UserModel> {
        try {
            const result = await this.prisma.user.create({
                data: {
                    email: createUser.email,
                    profilePicture: createUser.profilePicture,
                    username: createUser.username,
                    accounts: {
                        create: {
                            provider: createUser.oAuthAccount.provider,
                            providerUserId:
                                createUser.oAuthAccount.providerUserId,
                        },
                    },
                },
            });

            return mapPrismaUserToUserModel(result);
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

    async readUserByProvider(
        providerInfo: OAuthAccountModel
    ): Promise<UserModel | null> {
        try {
            const result = await this.prisma.oAuthAccount.findUnique({
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

            if (!result) {
                return null;
            }

            return mapPrismaUserToUserModel(result.user);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'UserRepository',
                method: 'createUser',
                functionInput: { providerInfo },
            });

            throw err;
        }
    }

    async readUserById(userId: UserIdModel): Promise<UserModel | null> {
        try {
            const result = await this.prisma.user.findUnique({
                where: {
                    userId,
                    deletedAt: null,
                },
            });

            if (!result) {
                return null;
            }

            return mapPrismaUserToUserModel(result);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'UserRepository',
                method: 'readUser',
                functionInput: { userId },
            });

            throw err;
        }
    }

    async updateUser(
        userId: UserIdModel,
        data: UpdateUserModel
    ): Promise<UserModel> {
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                const user = await tx.user.findUnique({
                    where: { userId, deletedAt: null },
                });

                if (!user) {
                    throw new EntityNotFoundError('User', userId);
                }

                return tx.user.update({
                    where: {
                        userId,
                    },
                    data,
                });
            });

            return mapPrismaUserToUserModel(result);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'UserRepository',
                method: 'updateUser',
                functionInput: { userId, data },
            });

            throw err;
        }
    }

    async hardDeleteUser(userId: UserIdModel): Promise<UserModel> {
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                const existingUser = await tx.user.findUnique({
                    where: { userId },
                });

                if (!existingUser) {
                    throw new EntityNotFoundError('User', userId);
                }

                return tx.user.delete({
                    where: {
                        userId,
                    },
                });
            });

            return mapPrismaUserToUserModel(result);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'UserRepository',
                method: 'hardDeleteUser',
                functionInput: { userId },
            });

            throw err;
        }
    }

    async softDeleteUser(userId: UserIdModel): Promise<UserModel> {
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                const existingUser = await tx.user.findUnique({
                    where: { userId },
                });

                if (!existingUser) {
                    throw new EntityNotFoundError('User', userId);
                }

                if (existingUser.deletedAt !== null) {
                    throw new EntityAlreadyDeletedError('User', userId);
                }

                return tx.user.update({
                    data: {
                        updatedAt: new Date(),
                        deletedAt: new Date(),
                    },
                    where: {
                        userId,
                    },
                });
            });

            return mapPrismaUserToUserModel(result);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'UserRepository',
                method: 'softDeleteUser',
                functionInput: { userId },
            });

            throw err;
        }
    }
}
