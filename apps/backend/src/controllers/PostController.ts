import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { UpdatePostDTO } from 'apps/backend/src/models/DTOs/PostDTO';
import { IPostController } from 'apps/backend/src/models/interfaces/controllers/IPostController';
import { IPostService } from 'apps/backend/src/models/interfaces/services/IPostService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import {
    CreatePostRequest,
    GetPostRequest,
    PostIdParams,
    UpdatePostRequest,
} from 'packages/shared';

@injectable()
export class PostController implements IPostController {
    constructor(
        @inject(SERVICE_IDENTIFIER.POST_SERVICE)
        readonly postService: IPostService
    ) {}

    async createPost(
        request: FastifyRequest<{ Body: CreatePostRequest }>,
        response: FastifyReply
    ): Promise<void> {
        const user = request.user;

        const newPost = await this.postService.createPost({
            userId: user.userId,
            ...request.body,
        });

        response.code(StatusCodes.OK).send({ post: newPost });
    }

    async getPost(
        request: FastifyRequest<{ Querystring: GetPostRequest }>,
        response: FastifyReply
    ): Promise<void> {
        const { postId, userId } = request.query;

        if (postId) {
            const post = await this.postService.getPostById({ postId });
            return response.code(StatusCodes.OK).send({ post });
        }

        if (userId) {
            const posts = await this.postService.getPostsByUser({ userId });

            response.code(StatusCodes.OK).send({ posts });
        }

        return response.code(400).send({
            message: 'Missing required query parameter.',
        });
    }

    async updatePost(
        request: FastifyRequest<{
            Body: UpdatePostRequest;
            Querystring: PostIdParams;
        }>,
        response: FastifyReply
    ): Promise<void> {
        const updatePostDTO: UpdatePostDTO = {
            postId: request.query.postId,
            updateData: {
                title: request.body.title,
                content: request.body.content,
            },
        };
        const updatedPost = await this.postService.updatePost(updatePostDTO);

        response.code(StatusCodes.OK).send({ updatedPost });
    }

    async deletePost(
        request: FastifyRequest<{ Querystring: PostIdParams }>,
        response: FastifyReply
    ): Promise<void> {
        const deletedPost = await this.postService.deletePost(request.query);

        response.code(StatusCodes.OK).send({ deletedPost });
    }
}
