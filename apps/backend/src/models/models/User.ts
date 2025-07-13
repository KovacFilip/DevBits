export type UserIdModel = string;

export type UserModel = {
    id: string;
    email?: string;
    username?: string;
    profilePicture?: string;
};

export type OAuthAccountModel = {
    provider: string;
    providerUserId: string;
};

export type CreateUserModel = {
    email?: string;
    username?: string;
    profilePicture?: string;
    oAuthAccount: OAuthAccountModel;
};

export type UpdateUserModel = {
    email?: string;
    username?: string;
    profilePicture?: string;
};
