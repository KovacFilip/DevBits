import { handleUpdateUser } from "apps/backend/src/controllers/UserController/Handlers/HandleUpdateUser";
import { IUserService } from "apps/backend/src/models/interfaces/services/IUserService";

export const createHandleUpdateUser = (userService: IUserService) => {
    return handleUpdateUser(userService);
}