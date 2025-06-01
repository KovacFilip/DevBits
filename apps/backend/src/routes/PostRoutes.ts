import { container } from 'apps/backend/src/config/inversify.config';
import { CONTROLLER_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { IPostController } from 'apps/backend/src/models/interfaces/controllers/IPostController';
import { FastifyInstance } from 'fastify';
import {
    CreatePostRequest,
    createPostSchema,
    GetPostRequest,
    getPostSchema,
    PostIdParams,
    postIdSchema,
    UpdatePostRequest,
    updatePostSchema,
} from 'packages/shared';

export const BASE_POST_ROUTE = '/post';

export const PostRoutes = (fastify: FastifyInstance) => {
    const postController = container.get<IPostController>(
        CONTROLLER_IDENTIFIER.POST_CONTROLLER
    );

    // Create New Post
    fastify.post<{ Body: CreatePostRequest }>(
        BASE_POST_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: { body: createPostSchema, tags: ['post'] },
        },
        postController.createPost.bind(postController)
    );

    // Get Post By ID
    fastify.get<{ Querystring: GetPostRequest }>(
        BASE_POST_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['post'],
                querystring: getPostSchema,
            },
        },
        postController.getPost.bind(postController)
    );

    // Update Post
    fastify.put<{ Body: UpdatePostRequest; Querystring: PostIdParams }>(
        BASE_POST_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                body: updatePostSchema,
                tags: ['post'],
                querystring: postIdSchema,
            },
        },
        postController.updatePost.bind(postController)
    );

    // Delete Post
    fastify.delete<{ Querystring: PostIdParams }>(
        BASE_POST_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['post'],
                querystring: postIdSchema,
            },
        },
        postController.deletePost.bind(postController)
    );
};
