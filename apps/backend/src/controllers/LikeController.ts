import { FastifyInstance } from 'fastify';
import { LikeIdDTO } from 'packages/shared';
import { GetLikeQueryDTO } from '../models/GetLikeQueryDTO';
import { LikeEntityQueryDTO } from '../models/LikeEntityQueryDTO';
import { LikeService } from '../services/LikeService';

export const BASE_LIKE_ROUTE = '/like';

const likeService = new LikeService();

export const likeRoutes = (fastify: FastifyInstance) => {
    // Create Like
    fastify.post<{ Querystring: LikeEntityQueryDTO }>(
        BASE_LIKE_ROUTE,
        async (request, response) => {
            const { commentId, postId } = request.query;
            // UserID - TODO: should be taken from auth header
            const userId = 'bd1c8f1a-5a1a-48b0-a2a1-dd7ebd742fe1';

            if (commentId) {
                const like = await likeService.likeComment({
                    userId,
                    entity: { commentId },
                });
                return response.code(200).send({ success: true, like });
            }

            if (postId) {
                const like = await likeService.likePost({
                    userId,
                    entity: { postId },
                });
                return response.code(200).send({ success: true, like });
            }

            return response.code(400).send({
                success: false,
                message: 'Missing required query parameter.',
            });
        }
    );

    // Get Like
    fastify.get<{ Querystring: GetLikeQueryDTO }>(
        BASE_LIKE_ROUTE,
        async (request, response) => {
            const { likeId, commentId, postId } = request.query;

            if (likeId) {
                const like = await likeService.getLike({ likeId });
                return response.code(200).send({ success: true, like });
            }

            if (commentId) {
                const likes = await likeService.getLikesForComment({
                    commentId,
                });
                return response.code(200).send({ success: true, likes });
            }

            if (postId) {
                const likes = await likeService.getLikesForPost({ postId });
                return response.code(200).send({ success: true, likes });
            }

            return response.code(400).send({
                success: false,
                message: 'Missing required query parameter.',
            });
        }
    );

    // Get Count Of Likes
    fastify.get<{ Querystring: LikeEntityQueryDTO }>(
        BASE_LIKE_ROUTE + '/count',
        async (request, response) => {
            const { commentId, postId } = request.query;

            if (commentId) {
                const count = await likeService.getNumberOfLikesOfComment({
                    commentId,
                });
                return response.code(200).send({ success: true, count });
            }

            if (postId) {
                const count = await likeService.getNumberOfLikesOfPost({
                    postId,
                });
                return response.code(200).send({ success: true, count });
            }

            return response.code(400).send({
                success: false,
                message: 'Missing required query parameter.',
            });
        }
    );

    // Remove Like
    fastify.delete<{ Querystring: LikeIdDTO }>(
        BASE_LIKE_ROUTE,
        async (request, response) => {
            const deletedLike = await likeService.removeLike(request.query);

            return response.code(200).send({ success: true, deletedLike });
        }
    );
};
