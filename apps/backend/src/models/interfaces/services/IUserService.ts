import {
    CreateUserDTO,
    UpdateUserDTO,
    UserIdDTO,
    UserResponseDTO,
} from 'apps/backend/src/models/DTOs/UserDTO';

export interface IUserService {
    registerUser(dto: CreateUserDTO): Promise<UserResponseDTO>;

    getUser(dto: UserIdDTO): Promise<UserResponseDTO>;

    updateUser(dto: UpdateUserDTO): Promise<UserResponseDTO>;

    deleteUser(dto: UserIdDTO): Promise<UserResponseDTO>;
}
