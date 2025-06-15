import {
    updateUserSchema,
    userDetailSchema,
    userIdSchema,
    userSimpleSchema,
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
export type UserSimpleDTO = z.infer<typeof userSimpleSchema>;
export type UserDetailDTO = z.infer<typeof userDetailSchema>;
