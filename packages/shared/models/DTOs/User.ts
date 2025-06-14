import {
    updateUserSchema,
    userIdSchema,
} from 'packages/shared/models/ZodSchemas';
import { z } from 'zod';

export type UserIdDTO = z.infer<typeof userIdSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;

export type CreateUserDTO = {
    email?: string;
    name?: string;
    profilePicture?: string;
    provider: 'google' | 'facebook' | 'github' | 'discord';
    providerUserId: string;
};

export type UserJWTPayload = {
    userId: string;
    email: string;
    name: string;
};

// USER RESPONSE DTOs
export type UserSimpleDTO = {
    userId: string;
};

export type UserDetailDTO = {
    userId: string;
    name: string | null;
    email: string | null;
    profilePicture: string | null;
};
