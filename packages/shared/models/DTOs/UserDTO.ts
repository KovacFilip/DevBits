export type CreateUserDTO = {
    email?: string;
    name?: string;
    profilePicture?: string;
    provider: 'google' | 'facebook' | 'github' | 'discord';
    providerUserId: string;
    // accessToken?: string;
    // refreshToken?: string;
    // expiresAt?: Date;
};

export type UserResponseDTO = {
    userId: string;
    email: string | null;
    profilePicture: string | null;
    username: string | null;
};
