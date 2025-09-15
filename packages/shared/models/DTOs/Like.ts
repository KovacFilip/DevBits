import { z } from "zod";
import { commentIdSchema } from "./Comment";
import { postIdSchema } from "./Post";
import { userIdSchema } from "./User";

export const likeIdSchema = z.strictObject({
    likeId: z.string().uuid(),
});

export const likeCommentSchema = z.strictObject({
    likeId: z.string().uuid(),
    user: userIdSchema,
    comment: commentIdSchema,
});

export const likeCommentArraySchema = z.array(likeCommentSchema);

export const likePostSchema = z.strictObject({
    likeId: z.string().uuid(),
    user: userIdSchema,
    post: postIdSchema,
});

export const likePostArraySchema = z.array(likePostSchema);

export const likeTypeUnionSchema = z.union([likeCommentSchema, likePostSchema]);

export const likeIdArraySchema = z.array(likeIdSchema);

export type LikeIdDTO = z.infer<typeof likeIdSchema>;
export type LikeCommentDTO = z.infer<typeof likeCommentSchema>;
export type LikePostDTO = z.infer<typeof likePostSchema>;
