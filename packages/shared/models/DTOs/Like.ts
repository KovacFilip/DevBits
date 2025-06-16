import {
    likeCommentSchema,
    likeIdSchema,
    likePostSchema,
} from 'packages/shared/models/ZodSchemas';
import { z } from 'zod';

export type LikeIdDTO = z.infer<typeof likeIdSchema>;
export type LikeCommentDTO = z.infer<typeof likeCommentSchema>;
export type LikePostDTO = z.infer<typeof likePostSchema>;
