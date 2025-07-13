import {
    LOGGER,
    REPOSITORY_IDENTIFIER,
} from 'apps/backend/src/constants/identifiers';
import { NotFoundError } from 'apps/backend/src/errors/NotFoundError';
import { logServiceErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import { mapUserModelToUserDetailDTO } from 'apps/backend/src/mappers/modelsToDtos/User';
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
                    oAuthAccount: {
                        provider: dto.provider,
                        providerUserId: dto.providerUserId,
                    },
                    username: dto.name,
                    profilePicture: dto.profilePicture,
                });
            }

            return mapUserModelToUserDetailDTO(user);
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
            const user = await this.userRepository.readUserById(dto.userId);

            if (!user) {
                throw new NotFoundError(
                    `Unable to find the user with ID: ${dto.userId}`
                );
            }

            return mapUserModelToUserDetailDTO(user);
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
            const updatedUser = await this.userRepository.updateUser(
                userIdDto.userId,
                {
                    email: updateUserDto.email,
                    username: updateUserDto.name,
                    profilePicture: updateUserDto.profilePicture,
                }
            );

            return mapUserModelToUserDetailDTO(updatedUser);
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
            const deletedUser = await this.userRepository.softDeleteUser(
                dto.userId
            );

            return {
                userId: deletedUser.id,
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
