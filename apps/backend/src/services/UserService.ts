import { CreateUserDTO, UserResponseDTO } from '@devbits/shared';
import { IUserService } from '../models/services/IUserService';
import { UserRepository } from '../repositories/UserRepository';

const userRepository = new UserRepository();

export class UserService implements IUserService {
    async registerUser(dto: CreateUserDTO): Promise<UserResponseDTO> {
        try {
            let user = await userRepository.readUserByProvider({
                provider: dto.provider,
                providerUserId: dto.providerUserId,
            });

            if (!user) {
                user = await userRepository.createUser({
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
        } catch (err) {
            // TODO: Logging
            // throw new Error('Unable to register new user');
            throw err;
        }
    }
}
