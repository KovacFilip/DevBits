import { handleGetUser } from 'apps/backend/src/controllers/UserController/Handlers/HandleGetUser';
import { IUserService } from 'apps/backend/src/models/interfaces/services/IUserService';

export const createHandleGetUser = (userService: IUserService) => {
    return handleGetUser(userService);
};
