import { FastifyInstance } from 'fastify';
import { LikeIdDTO } from 'packages/shared';
import { container } from '../config/inversify.config';
import { SERVICE_IDENTIFIER } from '../constants/identifiers';
import { GetLikeQueryDTO } from '../models/GetLikeQueryDTO';
import { ILikeService } from '../models/interfaces/services/ILikeService';
import { LikeEntityQueryDTO } from '../models/LikeEntityQueryDTO';

export const BASE_LIKE_ROUTE = '/like';

const likeService = container.get<ILikeService>(SERVICE_IDENTIFIER.LIKE_SERVICE);

export const likeRoutes = (fastify: FastifyInstance) => {
    // Create Like
    fastify.post<{ Querystring: LikeEntityQueryDTO }>(
        BASE_LIKE_ROUTE,
        {
            preHandler: [fastify.authenticate],
        },
        async (request, response) => {
            const { commentId, postId } = request.query;
            const user = request.user;

            if (commentId) {
                const like = await likeService.likeComment({
                    userId: user.userId,
                    entity: { commentId },
                });
                return response.code(200).send({ success: true, like });
            }

            if (postId) {
                const like = await likeService.likePost({
                    userId: user.userId,
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
        {
            preHandler: [fastify.authenticate],
        },
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
        {
            preHandler: [fastify.authenticate],
        },
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
        {
            preHandler: [fastify.authenticate],
        },
        async (request, response) => {
            const deletedLike = await likeService.removeLike(request.query);

            return response.code(200).send({ success: true, deletedLike });
        }
    );
};
