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

export const simplePostSchema = z.strictObject({
    postId: z.string().uuid(),
    userId: z.string().uuid(),
    title: z.string(),
});

export const postWithContentSchema = z.strictObject({
    postId: z.string().uuid(),
    userId: z.string().uuid(),
    title: z.string(),
    content: z.string(),
});

export const simplePostArraySchema = z.array(simplePostSchema);
