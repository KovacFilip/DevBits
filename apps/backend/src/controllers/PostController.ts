import {
    LOGGER,
    SERVICE_IDENTIFIER,
} from 'apps/backend/src/constants/identifiers';
import { logControllerErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
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
import { Logger } from 'pino';

@injectable()
export class PostController implements IPostController {
    constructor(
        @inject(SERVICE_IDENTIFIER.POST_SERVICE)
        readonly postService: IPostService,
        @inject(LOGGER.LOGGER) readonly logger: Logger
    ) {}

    async createPost(
        request: FastifyRequest<{ Body: CreatePostDTO }>,
        response: FastifyReply<{ Reply: PostWithContentDTO }>
    ): Promise<void> {
        try {
            const newPost = await this.postService.createPost(
                request.user,
                request.body
            );

            return response.code(StatusCodes.OK).send(newPost);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'PostController',
                method: 'createPost',
            });

            throw err;
        }
    }

    async getPost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: PostWithContentDTO }>
    ): Promise<void> {
        try {
            const post = await this.postService.getPostById(request.params);

            return response.code(StatusCodes.OK).send(post);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'PostController',
                method: 'getPost',
            });

            throw err;
        }
    }

    async getPostByUserId(
        request: FastifyRequest<{ Params: UserIdDTO }>,
        response: FastifyReply<{ Reply: PostSimpleDTO[] }>
    ): Promise<void> {
        try {
            const posts = await this.postService.getPostsByUser(request.params);

            return response.code(StatusCodes.OK).send(posts);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'PostController',
                method: 'getPostByUserId',
            });

            throw err;
        }
    }

    async updatePost(
        request: FastifyRequest<{
            Body: UpdatePostDTO;
            Params: PostIdDTO;
        }>,
        response: FastifyReply<{ Reply: PostWithContentDTO }>
    ): Promise<void> {
        try {
            const updatedPost = await this.postService.updatePost(
                request.params,
                request.body
            );

            return response.code(StatusCodes.OK).send(updatedPost);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'PostController',
                method: 'updatePost',
            });

            throw err;
        }
    }

    async deletePost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: PostSimpleDTO }>
    ): Promise<void> {
        try {
            const deletedPost = await this.postService.deletePost(
                request.params
            );

            return response.code(StatusCodes.OK).send(deletedPost);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'PostController',
                method: 'deletePost',
            });

            throw err;
        }
    }
}
