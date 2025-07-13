import { UserModel } from 'apps/backend/src/models/models/User';
import { UserDetailDTO } from 'packages/shared';

export const mapUserModelToUserDetailDTO = (
    userModel: UserModel
): UserDetailDTO => {
    return {
        userId: userModel.id,
        email: userModel.email ?? null,
        name: userModel.username ?? null,
        profilePicture: userModel.profilePicture ?? null,
    };
};
