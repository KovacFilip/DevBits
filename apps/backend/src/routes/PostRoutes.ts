import { container } from 'apps/backend/src/config/inversify.config';
import { CONTROLLER_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { IPostController } from 'apps/backend/src/models/interfaces/controllers/IPostController';
import { FastifyInstance } from 'fastify';
import {
    CreatePostDTO,
    createPostSchema,
    PostIdDTO,
    postIdSchema,
    PostSimpleDTO,
    PostWithContentDTO,
    postWithContentSchema,
    simplePostArraySchema,
    simplePostSchema,
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
    fastify.post<{ Body: CreatePostDTO; Reply: PostWithContentDTO }>(
        BASE_POST_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                body: createPostSchema,
                tags: ['post'],
                response: {
                    200: postWithContentSchema,
                },
            },
        },
        postController.createPost.bind(postController)
    );

    // Get Post By ID
    fastify.get<{ Params: PostIdDTO; Reply: PostWithContentDTO }>(
        '/post/:postId',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['post'],
                params: postIdSchema,
                response: {
                    200: postWithContentSchema,
                },
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
                response: {
                    200: simplePostArraySchema,
                },
            },
        },
        postController.getPostByUserId.bind(postController)
    );

    // Update Post
    fastify.put<{
        Body: UpdatePostDTO;
        Params: PostIdDTO;
        Reply: PostWithContentDTO;
    }>(
        '/post/:postId',
        {
            preHandler: [fastify.authenticate],
            schema: {
                body: updatePostSchema,
                tags: ['post'],
                params: postIdSchema,
                response: {
                    200: postWithContentSchema,
                },
            },
        },
        postController.updatePost.bind(postController)
    );

    // Delete Post
    fastify.delete<{ Params: PostIdDTO; Reply: PostSimpleDTO }>(
        '/post/:postId',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['post'],
                params: postIdSchema,
                response: {
                    200: simplePostSchema,
                },
            },
        },
        postController.deletePost.bind(postController)
    );
};
