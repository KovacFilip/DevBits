import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { IPostController } from 'apps/backend/src/models/interfaces/controllers/IPostController';
import { IPostService } from 'apps/backend/src/models/interfaces/services/IPostService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import {
    CreatePostDTO,
    PostIdDTO,
    PostSimpleDTO,
    PostWithContentDTO,
    UpdatePostDTO,
    UserIdDTO,
} from 'packages/shared';

@injectable()
export class PostController implements IPostController {
    constructor(
        @inject(SERVICE_IDENTIFIER.POST_SERVICE)
        readonly postService: IPostService
    ) {}

    async createPost(
        request: FastifyRequest<{ Body: CreatePostDTO }>,
        response: FastifyReply<{ Reply: PostWithContentDTO }>
    ): Promise<void> {
        const newPost = await this.postService.createPost(
            request.user,
            request.body
        );

        response.code(StatusCodes.OK).send(newPost);
    }

    async getPost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: PostWithContentDTO }>
    ): Promise<void> {
        const post = await this.postService.getPostById(request.params);

        return response.code(StatusCodes.OK).send(post);
    }

    async getPostByUserId(
        request: FastifyRequest<{ Params: UserIdDTO }>,
        response: FastifyReply<{ Reply: PostSimpleDTO[] }>
    ): Promise<void> {
        const posts = await this.postService.getPostsByUser(request.params);

        response.code(StatusCodes.OK).send(posts);
    }

    async updatePost(
        request: FastifyRequest<{
            Body: UpdatePostDTO;
            Params: PostIdDTO;
        }>,
        response: FastifyReply<{ Reply: PostWithContentDTO }>
    ): Promise<void> {
        const updatedPost = await this.postService.updatePost(
            request.params,
            request.body
        );

        response.code(StatusCodes.OK).send(updatedPost);
    }

    async deletePost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: PostSimpleDTO }>
    ): Promise<void> {
        const deletedPost = await this.postService.deletePost(request.params);

        response.code(StatusCodes.OK).send(deletedPost);
    }
}
