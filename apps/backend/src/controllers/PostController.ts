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
import { container } from '../config/inversify.config';
import { SERVICE_IDENTIFIER } from '../constants/identifiers';
import { UpdatePostDTO } from '../models/DTOs/PostDTO';
import { IPostService } from '../models/interfaces/services/IPostService';

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
            schema: { body: createPostSchema },
        },
        async (request, response) => {
            const user = request.user;

            const newPost = await postService.createPost({
                userId: user.userId,
                ...request.body,
            });

            response.code(200).send({ success: true, post: newPost });
        }
    );

    // Get Post By ID
    fastify.get<{ Querystring: GetPostRequest }>(
        BASE_POST_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                querystring: getPostSchema,
            },
        },
        async (request, response) => {
            const { postId, userId } = request.query;

            if (postId) {
                const post = await postService.getPostById({ postId });
                return response.code(200).send({ success: true, post });
            }

            if (userId) {
                const posts = await postService.getPostsByUser({ userId });

                response.code(200).send({ success: true, posts });
            }

            return response.code(400).send({
                success: false,
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

            response.code(200).send({ success: true, updatedPost });
        }
    );

    // Delete Post
    fastify.delete<{ Querystring: PostIdParams }>(
        BASE_POST_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                querystring: postIdSchema,
            },
        },
        async (request, response) => {
            const deletedPost = await postService.deletePost(request.query);

            response.code(200).send({ success: true, deletedPost });
        }
    );
};
