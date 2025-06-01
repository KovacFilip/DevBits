import { FastifyReply, FastifyRequest } from 'fastify';
import {
    CreatePostRequest,
    GetPostRequest,
    PostIdParams,
    UpdatePostRequest,
} from 'packages/shared';

export interface IPostController {
    createPost(
        request: FastifyRequest<{ Body: CreatePostRequest }>,
        response: FastifyReply
    ): Promise<void>;

    getPost(
        request: FastifyRequest<{ Querystring: GetPostRequest }>,
        response: FastifyReply
    ): Promise<void>;

    updatePost(
        request: FastifyRequest<{
            Body: UpdatePostRequest;
            Querystring: PostIdParams;
        }>,
        response: FastifyReply
    ): Promise<void>;

    deletePost(
        request: FastifyRequest<{ Querystring: PostIdParams }>,
        response: FastifyReply
    ): Promise<void>;
}
