import { container } from 'apps/backend/src/config/inversify.config';
import { CONTROLLER_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { ILikeController } from 'apps/backend/src/models/interfaces/controllers/ILikeController';
import { FastifyInstance } from 'fastify';
import {
    CommentIdDTO,
    commentIdSchema,
    LikeCommentDTO,
    likeIdArraySchema,
    LikeIdDTO,
    likeIdSchema,
    LikePostDTO,
    likeTypeUnionSchema,
    PostIdDTO,
    postIdSchema,
} from 'packages/shared';
import { z } from 'zod';

export const BASE_LIKE_ROUTE = '/like';

export const likeRoutes = (fastify: FastifyInstance) => {
    const likeController = container.get<ILikeController>(
        CONTROLLER_IDENTIFIER.LIKE_CONTROLLER
    );

    // Like a post
    fastify.post<{ Params: PostIdDTO; Reply: LikeIdDTO }>(
        '/post/:postId/like',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['like'],
                params: postIdSchema,
                response: {
                    200: likeIdSchema,
                },
            },
        },
        likeController.likePost.bind(likeController)
    );

    // Like a comment
    fastify.post<{ Params: CommentIdDTO; Reply: LikeIdDTO }>(
        '/comment/:commentId/like',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['like'],
                params: commentIdSchema,
                response: {
                    200: likeIdSchema,
                },
            },
        },
        likeController.likeComment.bind(likeController)
    );

    // Get Like
    fastify.get<{ Params: LikeIdDTO; Reply: LikePostDTO | LikeCommentDTO }>(
        '/like/:likeId',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['like'],
                params: likeIdSchema,
                response: {
                    200: likeTypeUnionSchema,
                },
            },
        },
        likeController.getLike.bind(likeController)
    );

    // Get Likes for post
    fastify.get<{ Params: PostIdDTO; Reply: LikeIdDTO[] }>(
        '/post/:postId/likes',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['like'],
                params: postIdSchema,
                response: {
                    200: likeIdArraySchema,
                },
            },
        },
        likeController.getLikesForPost.bind(likeController)
    );

    // Get likes for comment
    fastify.get<{ Params: CommentIdDTO; Reply: LikeIdDTO[] }>(
        '/comment/:commentId/likes',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['like'],
                params: commentIdSchema,
                response: {
                    200: likeIdArraySchema,
                },
            },
        },
        likeController.getLikesForComment.bind(likeController)
    );

    // Get Count Of Likes For Post
    fastify.get<{ Params: PostIdDTO; Reply: number }>(
        '/post/:postId/likes/count',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['like'],
                params: postIdSchema,
                response: {
                    200: z.number(),
                },
            },
        },
        likeController.getPostLikesCount.bind(likeController)
    );

    // Get Count Of Likes For Comment
    fastify.get<{ Params: CommentIdDTO; Reply: number }>(
        '/comment/:commentId/likes/count',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['like'],
                params: commentIdSchema,
                response: {
                    200: z.number(),
                },
            },
        },
        likeController.getCommentLikesCount.bind(likeController)
    );

    // Remove Like
    fastify.delete<{ Params: LikeIdDTO; Reply: LikeIdDTO }>(
        '/like/:likeId',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['like'],
                params: likeIdSchema,
                response: {
                    200: likeIdSchema,
                },
            },
        },
        likeController.deleteLike.bind(likeController)
    );
};
