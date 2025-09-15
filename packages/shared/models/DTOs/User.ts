import { z } from "zod";

// ===================
// User ID (e.g. query param)
// ===================
export const userIdSchema = z.strictObject({
    userId: z.string().uuid(),
});

// ===================
// Update User
// ===================
export const updateUserSchema = z.strictObject({
    email: z.string().email().optional(),
    name: z.string().optional(),
    profilePicture: z.string().optional(),
});

export const userSimpleSchema = z.strictObject({
    userId: z.string().uuid(),
});

export const userDetailSchema = z.strictObject({
    userId: z.string().uuid(),
    name: z.string().nullable(),
    email: z.string().email().nullable(),
    profilePicture: z.string().nullable(),
});

export type UserIdDTO = z.infer<typeof userIdSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;

export type CreateUserDTO = {
    email?: string;
    name?: string;
    profilePicture?: string;
    provider: "google" | "facebook" | "github" | "discord";
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
