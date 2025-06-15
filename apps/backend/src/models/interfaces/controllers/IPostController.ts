import { FastifyReply, FastifyRequest } from 'fastify';
import {
    CreatePostDTO,
    PostIdDTO,
    PostSimpleDTO,
    PostWithContentDTO,
    UpdatePostDTO,
    UserIdDTO,
} from 'packages/shared';

export interface IPostController {
    createPost(
        request: FastifyRequest<{ Body: CreatePostDTO }>,
        response: FastifyReply<{ Reply: PostWithContentDTO }>
    ): Promise<void>;

    getPost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: PostWithContentDTO }>
    ): Promise<void>;

    getPostByUserId(
        request: FastifyRequest<{ Params: UserIdDTO }>,
        response: FastifyReply<{ Reply: PostSimpleDTO[] }>
    ): Promise<void>;

    updatePost(
        request: FastifyRequest<{
            Body: UpdatePostDTO;
            Params: PostIdDTO;
        }>,
        response: FastifyReply<{ Reply: PostWithContentDTO }>
    ): Promise<void>;

    deletePost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: PostSimpleDTO }>
    ): Promise<void>;
}
