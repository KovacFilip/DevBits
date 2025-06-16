import { z } from 'zod';

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
