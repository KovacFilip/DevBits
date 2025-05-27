import { handleDeleteUser } from 'apps/backend/src/controllers/UserController/Handlers/HandleDeleteUser';
import { IUserService } from 'apps/backend/src/models/interfaces/services/IUserService';

export const createHandleDeleteUser = (userService: IUserService) => {
    return handleDeleteUser(userService);
};
