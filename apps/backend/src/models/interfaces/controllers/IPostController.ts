import { FastifyReply, FastifyRequest } from 'fastify';
import {
    CreatePostRequest,
    PostIdDTO,
    PostSimpleDTO,
    PostWithContentDTO,
    UpdatePostDTO,
    UserIdDTO,
} from 'packages/shared';

export interface IPostController {
    createPost(
        request: FastifyRequest<{ Body: CreatePostRequest }>,
        response: FastifyReply<{ Reply: PostWithContentDTO }>
    ): Promise<void>;

    getPost(
        request: FastifyRequest<{ Querystring: PostIdDTO }>,
        response: FastifyReply<{ Reply: PostWithContentDTO }>
    ): Promise<void>;

    getPostByUserId(
        request: FastifyRequest<{ Params: UserIdDTO }>,
        response: FastifyReply<{ Reply: PostSimpleDTO[] }>
    ): Promise<void>;

    updatePost(
        request: FastifyRequest<{
            Body: UpdatePostDTO;
            Querystring: PostIdDTO;
        }>,
        response: FastifyReply<{ Reply: PostWithContentDTO }>
    ): Promise<void>;

    deletePost(
        request: FastifyRequest<{ Querystring: PostIdDTO }>,
        response: FastifyReply<{ Reply: PostSimpleDTO }>
    ): Promise<void>;
}
