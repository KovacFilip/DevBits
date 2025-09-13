import { z } from "zod";

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

export type CreatePostDTO = z.infer<typeof createPostSchema>;
export type UpdatePostDTO = z.infer<typeof updatePostSchema>;
export type PostIdDTO = z.infer<typeof postIdSchema>;
export type PostSimpleDTO = z.infer<typeof simplePostSchema>;
export type PostWithContentDTO = z.infer<typeof postWithContentSchema>;
