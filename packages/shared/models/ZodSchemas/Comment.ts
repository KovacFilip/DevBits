import { z } from 'zod';

// ===================
// Create Comment
// ===================
export const createCommentSchema = z.strictObject({
    postId: z.string().uuid(),
    parentCommentId: z.string().uuid().optional(),
    content: z.string(),
});

// ===================
// Comment ID param
// ===================
export const commentIdSchema = z.strictObject({
    commentId: z.string().uuid(),
});

// ===================
// Update Comment
// ===================
export const updateCommentBodySchema = z.strictObject({
    content: z.string(),
});

// ===================
// Comment
// ===================
export const commentSchema = z.strictObject({
    commentId: z.string().uuid(),
    postId: z.string().uuid(),
    userId: z.string().uuid(),
    parentCommentId: z.string().uuid().optional(),
    content: z.string(),
});

// ===================
// Simple Comment
// ===================
export const simpleCommentSchema = z.strictObject({
    commentId: z.string().uuid(),
    content: z.string(),
});

export const simpleCommentArraySchema = z.array(simpleCommentSchema);
