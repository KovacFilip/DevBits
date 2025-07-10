import { Prisma } from 'apps/backend/prisma/generated/client';
import {
    LOGGER,
    REPOSITORY_IDENTIFIER,
} from 'apps/backend/src/constants/identifiers';
import { NotFoundError } from 'apps/backend/src/errors/NotFoundError';
import { logServiceErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import { IUserRepository } from 'apps/backend/src/models/interfaces/repositories/IUserRepository';
import { IUserService } from 'apps/backend/src/models/interfaces/services/IUserService';
import { inject, injectable } from 'inversify';
import {
    CreateUserDTO,
    UpdateUserDTO,
    UserDetailDTO,
    UserIdDTO,
    UserSimpleDTO,
} from 'packages/shared';
import { Logger } from 'pino';

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(REPOSITORY_IDENTIFIER.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @inject(LOGGER.LOGGER) private readonly logger: Logger
    ) {}

    async registerUser(dto: CreateUserDTO): Promise<UserDetailDTO> {
        try {
            let user = await this.userRepository.readUserByProvider({
                provider: dto.provider,
                providerUserId: dto.providerUserId,
            });

            if (!user) {
                user = await this.userRepository.createUser({
                    email: dto.email,
                    profilePicture: dto.profilePicture,
                    username: dto.name,
                    accounts: {
                        create: {
                            provider: dto.provider,
                            providerUserId: dto.providerUserId,
                        },
                    },
                });
            }

            return {
                userId: user.userId,
                email: user.email,
                profilePicture: user.profilePicture,
                name: user.username,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'UserService',
                method: 'registerUser',
            });

            throw err;
        }
    }

    async getUser(dto: UserIdDTO): Promise<UserDetailDTO> {
        try {
            const userWhereInput: Prisma.UserWhereUniqueInput = {
                userId: dto.userId,
            };

            const user = await this.userRepository.readUser(userWhereInput);

            if (!user) {
                throw new NotFoundError(
                    `Unable to find the user with ID: ${dto.userId}`
                );
            }

            return {
                userId: user.userId,
                email: user.email,
                profilePicture: user.profilePicture,
                name: user.username,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'UserService',
                method: 'getUser',
            });

            throw err;
        }
    }

    async updateUser(
        userIdDto: UserIdDTO,
        updateUserDto: UpdateUserDTO
    ): Promise<UserDetailDTO> {
        try {
            const userWhereInput: Prisma.UserWhereUniqueInput = {
                userId: userIdDto.userId,
            };

            const updateData: Prisma.UserUpdateInput = {
                email: updateUserDto.email,
                username: updateUserDto.name,
                profilePicture: updateUserDto.profilePicture,
            };

            const updatedUser = await this.userRepository.updateUser(
                userWhereInput,
                updateData
            );

            return {
                userId: updatedUser.userId,
                email: updatedUser.email,
                name: updatedUser.username,
                profilePicture: updatedUser.profilePicture,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { userIdDto, updateUserDto },
                service: 'UserService',
                method: 'updateUser',
            });

            throw err;
        }
    }

    async deleteUser(dto: UserIdDTO): Promise<UserSimpleDTO> {
        try {
            const userWhereInput: Prisma.UserWhereUniqueInput = {
                userId: dto.userId,
            };

            const deletedUser =
                await this.userRepository.softDeleteUser(userWhereInput);

            return {
                userId: deletedUser.userId,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'UserService',
                method: 'deleteUser',
            });

            throw err;
        }
    }
}
