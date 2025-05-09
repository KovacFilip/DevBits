export type CreateUserDTO = {
    email?: string;
    name?: string;
    profilePicture?: string;
    provider: 'google' | 'facebook' | 'github' | 'discord';
    providerUserId: string;
};

export type UserResponseDTO = {
    userId: string;
    email: string | null;
    profilePicture: string | null;
    username: string | null;
};

export type UserIdDTO = {
    userId: string;
};

export type UpdateUserDTO = {
    userId: string;
    updateData: {
        email?: string;
        name?: string;
        profilePicture?: string;
    };
};
