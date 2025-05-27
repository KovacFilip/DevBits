import { container } from 'apps/backend/src/config/inversify.config';
import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { ILikeService } from 'apps/backend/src/models/interfaces/services/ILikeService';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import {
    GetCountOfLikesRequest,
    getCountOfLikesSchema,
    GetLikeRequest,
    getLikeSchema,
    LikeIdRequest,
    likeIdSchema,
} from 'packages/shared';

export const BASE_LIKE_ROUTE = '/like';

const likeService = container.get<ILikeService>(
    SERVICE_IDENTIFIER.LIKE_SERVICE
);

export const likeRoutes = (fastify: FastifyInstance) => {
    // Create Like
    fastify.post<{ Querystring: GetCountOfLikesRequest }>(
        BASE_LIKE_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['like'],
                querystring: getCountOfLikesSchema,
            },
        },
        async (request, response) => {
            const { commentId, postId } = request.query;
            const user = request.user;

            if (commentId) {
                const like = await likeService.likeComment({
                    userId: user.userId,
                    entity: { commentId },
                });
                return response.code(StatusCodes.OK).send({ like });
            }

            if (postId) {
                const like = await likeService.likePost({
                    userId: user.userId,
                    entity: { postId },
                });
                return response.code(StatusCodes.OK).send({ like });
            }

            return response.code(400).send({
                message: 'Missing required query parameter.',
            });
        }
    );

    // Get Like
    fastify.get<{ Querystring: GetLikeRequest }>(
        BASE_LIKE_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['like'],
                querystring: getLikeSchema,
            },
        },
        async (request, response) => {
            const { likeId, commentId, postId } = request.query;

            if (likeId) {
                const like = await likeService.getLike({ likeId });
                return response.code(StatusCodes.OK).send({ like });
            }

            if (commentId) {
                const likes = await likeService.getLikesForComment({
                    commentId,
                });
                return response.code(StatusCodes.OK).send({ likes });
            }

            if (postId) {
                const likes = await likeService.getLikesForPost({ postId });
                return response.code(StatusCodes.OK).send({ likes });
            }

            return response.code(400).send({
                message: 'Missing required query parameter.',
            });
        }
    );

    // Get Count Of Likes
    fastify.get<{ Querystring: GetCountOfLikesRequest }>(
        BASE_LIKE_ROUTE + '/count',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['like'],
                querystring: getCountOfLikesSchema,
            },
        },
        async (request, response) => {
            const { commentId, postId } = request.query;

            if (commentId) {
                const count = await likeService.getNumberOfLikesOfComment({
                    commentId,
                });
                return response.code(StatusCodes.OK).send({ count });
            }

            if (postId) {
                const count = await likeService.getNumberOfLikesOfPost({
                    postId,
                });
                return response.code(StatusCodes.OK).send({ count });
            }

            return response.code(400).send({
                message: 'Missing required query parameter.',
            });
        }
    );

    // Remove Like
    fastify.delete<{ Querystring: LikeIdRequest }>(
        BASE_LIKE_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['like'],
                querystring: likeIdSchema,
            },
        },
        async (request, response) => {
            const deletedLike = await likeService.removeLike(request.query);

            return response.code(StatusCodes.OK).send({ deletedLike });
        }
    );
};
