import { z } from 'zod';

// ===================
// Create Post
// ===================
export const createPostSchema = z.strictObject({
    title: z.string(),
    content: z.string(),
});

// ===================
// Post ID param
// ===================
export const postIdSchema = z.strictObject({
    postId: z.string().uuid(),
});

// ===================
// Update Post
// ===================
export const updatePostSchema = z.strictObject({
    title: z.string().optional(),
    content: z.string().optional(),
});
