import { FastifyInstance } from 'fastify';
import { CreatePostDTO, PostIdDTO, UpdatePostDTO } from 'packages/shared';
import { GetPostQueryDTO } from '../models/GetPostQueryDTO';
import { PostService } from '../services/PostService';

export const BASE_POST_ROUTE = '/post';

const postService = new PostService();

export const postRoutes = (fastify: FastifyInstance) => {
    // Create New Post
    fastify.post<{ Body: Omit<CreatePostDTO, 'userId'> }>(
        BASE_POST_ROUTE,
        async (request, response) => {
            // const { title, content } = request.body;
            const userId = 'bd1c8f1a-5a1a-48b0-a2a1-dd7ebd742fe1';

            const newPost = await postService.createPost({
                userId,
                ...request.body,
            });

            response.code(200).send({ success: true, post: newPost });
        }
    );

    // Get Post By ID
    fastify.get<{ Querystring: GetPostQueryDTO }>(
        BASE_POST_ROUTE,
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
    fastify.put<{ Body: UpdatePostDTO }>(
        BASE_POST_ROUTE,
        async (request, response) => {
            const updatedPost = await postService.updatePost(request.body);

            response.code(200).send({ success: true, updatedPost });
        }
    );

    // Delete Post
    fastify.delete<{ Querystring: PostIdDTO }>(
        BASE_POST_ROUTE,
        async (request, response) => {
            const deletedPost = await postService.deletePost(request.query);

            response.code(200).send({ success: true, deletedPost });
        }
    );
};
