import { z } from 'zod';

// ===================
// User ID (e.g. query param)
// ===================
export const userIdSchema = z.strictObject({
    userId: z.string().uuid(),
});
export type UserIdParams = z.infer<typeof userIdSchema>;

// ===================
// Update User
// ===================
export const updateUserSchema = z.strictObject({
    email: z.string().email().optional(),
    name: z.string().optional(),
    profilePicture: z.string().optional(),
});
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
