import {
    CreateUserDTO,
    UpdateUserDTO,
    UserIdDTO,
    UserResponseDTO,
} from '@devbits/shared';
import { Prisma } from 'apps/backend/prisma/generated/client';
import { inject, injectable } from 'inversify';
import { REPOSITORY_IDENTIFIER } from '../constants/identifiers';
import { NotFoundError } from '../errors/NotFoundError';
import { IUserRepository } from '../models/interfaces/repositories/IUserRepository';
import { IUserService } from '../models/interfaces/services/IUserService';

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(REPOSITORY_IDENTIFIER.USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) {}

    async registerUser(dto: CreateUserDTO): Promise<UserResponseDTO> {
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
            username: user.username,
        };
    }

    async getUser(dto: UserIdDTO): Promise<UserResponseDTO> {
        const userWhereInput: Prisma.UserWhereUniqueInput = {
            userId: dto.userId,
        };

        const user = await this.userRepository.readUser(userWhereInput);

        if (!user) {
            throw new NotFoundError(
                `Unable to find the user with ID: ${dto.userId}`
            );
        }

        const result: UserResponseDTO = {
            userId: user.userId,
            email: user.email,
            profilePicture: user.profilePicture,
            username: user.username,
        };

        return result;
    }

    async updateUser(dto: UpdateUserDTO): Promise<UserResponseDTO> {
        const userWhereInput: Prisma.UserWhereUniqueInput = {
            userId: dto.userId,
        };

        const updateData: Prisma.UserUpdateInput = {
            email: dto.updateData.email,
            username: dto.updateData.name,
            profilePicture: dto.updateData.profilePicture,
        };

        const updatedUser = await this.userRepository.updateUser(
            userWhereInput,
            updateData
        );

        return {
            userId: updatedUser.userId,
            email: updatedUser.email,
            username: updatedUser.username,
            profilePicture: updatedUser.profilePicture,
        };
    }

    async deleteUser(dto: UserIdDTO): Promise<UserResponseDTO> {
        const userWhereInput: Prisma.UserWhereUniqueInput = {
            userId: dto.userId,
        };

        const deletedUser =
            await this.userRepository.softDeleteUser(userWhereInput);

        return {
            userId: deletedUser.userId,
            email: deletedUser.email,
            username: deletedUser.username,
            profilePicture: deletedUser.profilePicture,
        };
    }
}
