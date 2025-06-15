import { container } from 'apps/backend/src/config/inversify.config';
import { CONTROLLER_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { ICommentController } from 'apps/backend/src/models/interfaces/controllers/ICommentController';
import { FastifyInstance } from 'fastify';
import {
    CommentDTO,
    CommentIdDTO,
    commentIdSchema,
    commentSchema,
    CreateCommentDTO,
    createCommentSchema,
    PostIdDTO,
    postIdSchema,
    simpleCommentArraySchema,
    SimpleCommentDTO,
    simpleCommentSchema,
    updateCommentBodySchema,
    UpdateCommentDTO,
    UserIdDTO,
    userIdSchema,
} from 'packages/shared';

export const BASE_COMMENT_ROUTE = '/comment';

export const CommentRoutes = (fastify: FastifyInstance) => {
    const commentController = container.get<ICommentController>(
        CONTROLLER_IDENTIFIER.COMMENT_CONTROLLER
    );

    // Create Comment
    fastify.post<{ Body: CreateCommentDTO; Reply: CommentDTO }>(
        BASE_COMMENT_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['comment'],
                body: createCommentSchema,
                response: {
                    200: commentSchema,
                },
            },
        },
        commentController.createComment.bind(commentController)
    );

    // Get Comment By Comment ID
    fastify.get<{ Params: CommentIdDTO; Reply: CommentDTO }>(
        '/comment/:commentId',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['comment'],
                params: commentIdSchema,
                response: {
                    200: commentSchema,
                },
            },
        },
        commentController.getComment.bind(commentController)
    );

    // Get Comments For Post By Post ID
    fastify.get<{ Params: PostIdDTO; Reply: SimpleCommentDTO[] }>(
        '/post/:postId/comments',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['comment'],
                params: postIdSchema,
                response: {
                    200: simpleCommentArraySchema,
                },
            },
        },
        commentController.getCommentsForPost.bind(commentController)
    );

    // Get Comments Created by user with UserId
    fastify.get<{ Params: UserIdDTO; Reply: SimpleCommentDTO[] }>(
        '/user/:userId/comments',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['comment'],
                params: userIdSchema,
                response: {
                    200: simpleCommentArraySchema,
                },
            },
        },
        commentController.getCommentsByUser.bind(commentController)
    );

    // Update Comment
    fastify.put<{
        Body: UpdateCommentDTO;
        Params: CommentIdDTO;
        Reply: CommentDTO;
    }>(
        BASE_COMMENT_ROUTE + '/:commentId',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['comment'],
                params: commentIdSchema,
                body: updateCommentBodySchema,
                response: {
                    200: commentSchema,
                },
            },
        },
        commentController.updateComment.bind(commentController)
    );

    // Delete Comment
    fastify.delete<{ Params: CommentIdDTO; Reply: SimpleCommentDTO }>(
        BASE_COMMENT_ROUTE + '/:commentId',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['comment'],
                params: commentIdSchema,
                response: {
                    200: simpleCommentSchema,
                },
            },
        },
        commentController.deleteComment.bind(commentController)
    );
};
