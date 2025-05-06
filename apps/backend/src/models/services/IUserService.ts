import { CreateUserDTO, UserResponseDTO } from 'packages/shared';

export interface IUserService {
    registerUser(dto: CreateUserDTO): Promise<UserResponseDTO>;
}
