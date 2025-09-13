import {
    likeCommentSchema,
    likeIdSchema,
    likePostSchema,
} from "@/models/ZodSchemas/Like";
import { z } from "zod";

export type LikeIdDTO = z.infer<typeof likeIdSchema>;
export type LikeCommentDTO = z.infer<typeof likeCommentSchema>;
export type LikePostDTO = z.infer<typeof likePostSchema>;
