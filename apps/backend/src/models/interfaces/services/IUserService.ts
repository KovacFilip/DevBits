import {
    CreateUserDTO,
    UpdateUserDTO,
    UserDetailDTO,
    UserIdDTO,
    UserSimpleDTO,
} from 'packages/shared';

export interface IUserService {
    registerUser(dto: CreateUserDTO): Promise<UserDetailDTO>;

    getUser(dto: UserIdDTO): Promise<UserDetailDTO>;

    updateUser(
        userIdDto: UserIdDTO,
        updateUserDto: UpdateUserDTO
    ): Promise<UserDetailDTO>;

    deleteUser(dto: UserIdDTO): Promise<UserSimpleDTO>;
}
