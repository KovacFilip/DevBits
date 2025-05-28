import { container } from 'apps/backend/src/config/inversify.config';
import { CONTROLLER_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { ICommentController } from 'apps/backend/src/models/interfaces/controllers/ICommentController';
import { FastifyInstance } from 'fastify';
import {
    CommentIdParams,
    commentIdSchema,
    CreateCommentRequest,
    createCommentSchema,
    GetCommentRequest,
    getCommentSchema,
    updateCommentBodySchema,
    UpdateCommentRequestBody,
} from 'packages/shared';

export const BASE_COMMENT_ROUTE = '/comment';

export const CommentRoutes = (fastify: FastifyInstance) => {
    const commentController = container.get<ICommentController>(
        CONTROLLER_IDENTIFIER.COMMENT_CONTROLLER
    );

    // Create Comment
    fastify.post<{ Body: CreateCommentRequest }>(
        BASE_COMMENT_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['comment'],
                body: createCommentSchema,
            },
        },
        commentController.createComment.bind(commentController)
    );

    // Get Comment
    fastify.get<{ Querystring: GetCommentRequest }>(
        BASE_COMMENT_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['comment'],
                querystring: getCommentSchema,
            },
        },
        commentController.getComment.bind(commentController)
    );

    // Update Comment
    fastify.put<{
        Body: UpdateCommentRequestBody;
        Querystring: CommentIdParams;
    }>(
        BASE_COMMENT_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['comment'],
                querystring: commentIdSchema,
                body: updateCommentBodySchema,
            },
        },
        commentController.updateComment.bind(commentController)
    );

    // Delete Comment
    fastify.delete<{ Querystring: CommentIdParams }>(
        BASE_COMMENT_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['comment'],
                querystring: commentIdSchema,
            },
        },
        commentController.deleteComment.bind(commentController)
    );
};
