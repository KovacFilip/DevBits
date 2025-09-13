import {
    commentIdSchema,
    commentSchema,
    createCommentSchema,
    simpleCommentSchema,
    updateCommentBodySchema,
} from "@/models/ZodSchemas/Comment";
import { z } from "zod";

export type CreateCommentDTO = z.infer<typeof createCommentSchema>;
export type CommentIdDTO = z.infer<typeof commentIdSchema>;
export type UpdateCommentDTO = z.infer<typeof updateCommentBodySchema>;
export type CommentDTO = z.infer<typeof commentSchema>;
export type SimpleCommentDTO = z.infer<typeof simpleCommentSchema>;
