import { z } from 'zod';

// ===================
// Create Post
// ===================
export const createPostSchema = z.strictObject({
    title: z.string(),
    content: z.string(),
});
export type CreatePostRequest = z.infer<typeof createPostSchema>;

// ===================
// Get Post (by postId or userId)
// ===================
export const getPostSchema = z
    .strictObject({
        postId: z.string().uuid().optional(),
        userId: z.string().uuid().optional(),
    })
    .refine(
        (data) =>
            (data.postId && !data.userId) || (!data.postId && data.userId),
        {
            message: "Exactly one of 'postId' or 'userId' must be provided",
        }
    );
export type GetPostRequest = z.infer<typeof getPostSchema>;

// ===================
// Post ID param
// ===================
export const postIdSchema = z.strictObject({
    postId: z.string().uuid(),
});
export type PostIdParams = z.infer<typeof postIdSchema>;

// ===================
// Update Post
// ===================
export const updatePostSchema = z.strictObject({
    title: z.string().optional(),
    content: z.string().optional(),
});
export type UpdatePostRequest = z.infer<typeof updatePostSchema>;
