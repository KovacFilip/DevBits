import {
    CreateUserModel,
    OAuthAccountModel,
    UpdateUserModel,
    UserIdModel,
    UserModel,
} from 'apps/backend/src/models/models/User';

export interface IUserRepository {
    createUser(createUser: CreateUserModel): Promise<UserModel>;

    readUserById(userId: UserIdModel): Promise<UserModel | null>;

    readUserByProvider(
        providerInfo: OAuthAccountModel
    ): Promise<UserModel | null>;
    updateUser(where: UserIdModel, data: UpdateUserModel): Promise<UserModel>;

    hardDeleteUser(user: UserIdModel): Promise<UserModel>;
    softDeleteUser(user: UserIdModel): Promise<UserModel>;
}
