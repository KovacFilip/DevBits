import { commentIdSchema } from "@/models/ZodSchemas/Comment";
import { postIdSchema } from "@/models/ZodSchemas/Post";
import { userIdSchema } from "@/models/ZodSchemas/User";
import { z } from "zod";

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
