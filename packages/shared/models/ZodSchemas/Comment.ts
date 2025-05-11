import { z } from 'zod';

// ===================
// Create Comment
// ===================
export const createCommentSchema = z.strictObject({
    postId: z.string().uuid(),
    parentCommentId: z.string().uuid().optional(),
    content: z.string(),
});
export type CreateCommentRequest = z.infer<typeof createCommentSchema>;

// ===================
// Get Comment(s) (by commentId, userId or postId)
// ===================
export const getCommentSchema = z
    .strictObject({
        commentId: z.string().uuid().optional(),
        postId: z.string().uuid().optional(),
        userId: z.string().uuid().optional(),
    })
    .refine(
        (data) => {
            const values = [data.commentId, data.postId, data.userId];
            const definedCount = values.filter((v) => v !== undefined).length;
            return definedCount === 1;
        },
        {
            message:
                "Exactly one of 'commentId', 'postId', or 'userId' must be provided",
        }
    );
export type GetCommentRequest = z.infer<typeof getCommentSchema>;

// ===================
// Comment ID param
// ===================
export const commentIdSchema = z.strictObject({
    commentId: z.string().uuid(),
});
export type CommentIdParams = z.infer<typeof commentIdSchema>;

// ===================
// Update Post
// ===================
export const updateCommentBodySchema = z.strictObject({
    content: z.string(),
});
export type UpdateCommentRequestBody = z.infer<typeof updateCommentBodySchema>;
