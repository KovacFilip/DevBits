import { z } from 'zod';

// ===================
// Like (postId or userId)
// ===================
export const createLikeSchema = z
    .strictObject({
        postId: z.string().uuid().optional(),
        commentId: z.string().uuid().optional(),
    })
    .refine(
        (data) =>
            (data.postId && !data.commentId) ||
            (!data.postId && data.commentId),
        {
            message: "Exactly one of 'postId' or 'commentId' must be provided",
        }
    );
export type createLikeRequest = z.infer<typeof createLikeSchema>;

// ===================
// Like (postId or userId)
// ===================
export const getCountOfLikesSchema = z
    .strictObject({
        postId: z.string().uuid().optional(),
        commentId: z.string().uuid().optional(),
    })
    .refine(
        (data) =>
            (data.postId && !data.commentId) ||
            (!data.postId && data.commentId),
        {
            message: "Exactly one of 'postId' or 'commentId' must be provided",
        }
    );
export type GetCountOfLikesRequest = z.infer<typeof getCountOfLikesSchema>;

// ===================
// Like (likeId, postId or userId)
// ===================
export const getLikeSchema = z
    .strictObject({
        likeId: z.string().uuid().optional(),
        postId: z.string().uuid().optional(),
        commentId: z.string().uuid().optional(),
    })
    .refine(
        (data) => {
            const values = [data.likeId, data.postId, data.commentId];
            const definedCount = values.filter((v) => v !== undefined).length;
            return definedCount === 1;
        },
        {
            message:
                "Exactly one of 'likeId', 'postId', or 'commentId' must be provided",
        }
    );

export type GetLikeRequest = z.infer<typeof getLikeSchema>;

// ===================
// Like ID (e.g. query param)
// ===================
export const likeIdSchema = z.strictObject({
    likeId: z.string().uuid(),
});
export type LikeIdRequest = z.infer<typeof likeIdSchema>;
