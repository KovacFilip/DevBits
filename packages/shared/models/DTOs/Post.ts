import {
    createPostSchema,
    postIdSchema,
    postWithContentSchema,
    simplePostSchema,
    updatePostSchema,
} from "@/models/ZodSchemas/Post";
import { z } from "zod";

export type CreatePostDTO = z.infer<typeof createPostSchema>;
export type UpdatePostDTO = z.infer<typeof updatePostSchema>;
export type PostIdDTO = z.infer<typeof postIdSchema>;
export type PostSimpleDTO = z.infer<typeof simplePostSchema>;
export type PostWithContentDTO = z.infer<typeof postWithContentSchema>;
