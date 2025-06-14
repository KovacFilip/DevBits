import { container } from 'apps/backend/src/config/inversify.config';
import { CONTROLLER_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { IPostController } from 'apps/backend/src/models/interfaces/controllers/IPostController';
import { FastifyInstance } from 'fastify';
import {
    CreatePostRequest,
    createPostSchema,
    PostIdDTO,
    postIdSchema,
    PostSimpleDTO,
    PostWithContentDTO,
    UpdatePostDTO,
    updatePostSchema,
    UserIdDTO,
    userIdSchema,
} from 'packages/shared';

export const BASE_POST_ROUTE = '/post';

export const PostRoutes = (fastify: FastifyInstance) => {
    const postController = container.get<IPostController>(
        CONTROLLER_IDENTIFIER.POST_CONTROLLER
    );

    // Create New Post
    fastify.post<{ Body: CreatePostRequest; Reply: PostWithContentDTO }>(
        BASE_POST_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: { body: createPostSchema, tags: ['post'] },
        },
        postController.createPost.bind(postController)
    );

    // Get Post By ID
    fastify.get<{ Querystring: PostIdDTO; Reply: PostWithContentDTO }>(
        BASE_POST_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['post'],
                querystring: postIdSchema,
            },
        },
        postController.getPost.bind(postController)
    );

    // Get Posts By UserID
    fastify.get<{ Params: UserIdDTO; Reply: PostSimpleDTO[] }>(
        '/user/:userId/posts',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['post'],
                params: userIdSchema,
            },
        },
        postController.getPostByUserId.bind(postController)
    );

    // Update Post
    fastify.put<{
        Body: UpdatePostDTO;
        Querystring: PostIdDTO;
        Reply: PostWithContentDTO;
    }>(
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
    fastify.delete<{ Querystring: PostIdDTO; Reply: PostSimpleDTO }>(
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
