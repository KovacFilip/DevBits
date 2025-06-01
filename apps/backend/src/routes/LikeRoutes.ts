import { container } from 'apps/backend/src/config/inversify.config';
import { CONTROLLER_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { ILikeController } from 'apps/backend/src/models/interfaces/controllers/ILikeController';
import { FastifyInstance } from 'fastify';
import {
    GetCountOfLikesRequest,
    getCountOfLikesSchema,
    GetLikeRequest,
    getLikeSchema,
    LikeIdRequest,
    likeIdSchema,
} from 'packages/shared';

export const BASE_LIKE_ROUTE = '/like';

export const likeRoutes = (fastify: FastifyInstance) => {
    const likeController = container.get<ILikeController>(
        CONTROLLER_IDENTIFIER.LIKE_CONTROLLER
    );

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
        likeController.createLike.bind(likeController)
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
        likeController.getLike.bind(likeController)
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
        likeController.getLikesCount.bind(likeController)
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
        likeController.deleteLike.bind(likeController)
    );
};
