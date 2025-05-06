import { CreateUserDTO, UserResponseDTO } from '@devbits/shared';
import { IUserService } from '../models/services/IUserService';
import { UserRepository } from '../repositories/UserRepository';

const userRepository = new UserRepository();

export class UserService implements IUserService {
    async registerUser(dto: CreateUserDTO): Promise<UserResponseDTO> {
        try {
            const user = await userRepository.createUser({
                email: dto.email,
                profilePicture: dto.profilePicture,
                accounts: {
                    create: {
                        provider: dto.provider,
                        providerUserId: dto.providerUserId,
                    },
                },
            });

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
