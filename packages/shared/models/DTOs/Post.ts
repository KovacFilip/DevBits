import {
    createPostSchema,
    postIdSchema,
    updatePostSchema,
} from 'packages/shared/models/ZodSchemas';
import { z } from 'zod';

export type CreatePostRequest = z.infer<typeof createPostSchema>;
export type UpdatePostDTO = z.infer<typeof updatePostSchema>;
export type PostIdDTO = z.infer<typeof postIdSchema>;

export type PostSimpleDTO = {
    postId: string;
    userId: string;
    title: string;
};

export type PostWithContentDTO = {
    postId: string;
    userId: string;
    title: string;
    content: string;
};

export type CreatePostDTO = {
    userId: string;
    title: string;
    content: string;
};
