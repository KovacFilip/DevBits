import { container } from 'apps/backend/src/config/inversify.config';
import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { UpdatePostDTO } from 'apps/backend/src/models/DTOs/PostDTO';
import { IPostService } from 'apps/backend/src/models/interfaces/services/IPostService';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
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

const postService = container.get<IPostService>(
    SERVICE_IDENTIFIER.POST_SERVICE
);

export const postRoutes = (fastify: FastifyInstance) => {
    // Create New Post
    fastify.post<{ Body: CreatePostRequest }>(
        BASE_POST_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: { body: createPostSchema, tags: ['post'] },
        },
        async (request, response) => {
            const user = request.user;

            const newPost = await postService.createPost({
                userId: user.userId,
                ...request.body,
            });

            response.code(StatusCodes.OK).send({ post: newPost });
        }
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
        async (request, response) => {
            const { postId, userId } = request.query;

            if (postId) {
                const post = await postService.getPostById({ postId });
                return response.code(StatusCodes.OK).send({ post });
            }

            if (userId) {
                const posts = await postService.getPostsByUser({ userId });

                response.code(StatusCodes.OK).send({ posts });
            }

            return response.code(400).send({
                message: 'Missing required query parameter.',
            });
        }
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
        async (request, response) => {
            const updatePostDTO: UpdatePostDTO = {
                postId: request.query.postId,
                updateData: {
                    title: request.body.title,
                    content: request.body.content,
                },
            };
            const updatedPost = await postService.updatePost(updatePostDTO);

            response.code(StatusCodes.OK).send({ updatedPost });
        }
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
        async (request, response) => {
            const deletedPost = await postService.deletePost(request.query);

            response.code(StatusCodes.OK).send({ deletedPost });
        }
    );
};
