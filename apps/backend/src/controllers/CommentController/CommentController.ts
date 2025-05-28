import { container } from 'apps/backend/src/config/inversify.config';
import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { handleCreateComment } from 'apps/backend/src/controllers/CommentController/Handlers/HandleCreateComment';
import { handleDeleteComment } from 'apps/backend/src/controllers/CommentController/Handlers/HandleDeleteComment';
import { handleGetComment } from 'apps/backend/src/controllers/CommentController/Handlers/HandleGetComment';
import { handleUpdateComment } from 'apps/backend/src/controllers/CommentController/Handlers/HandleUpdateComment';
import { ICommentService } from 'apps/backend/src/models/interfaces/services/ICommentService';
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

const commentService = container.get<ICommentService>(
    SERVICE_IDENTIFIER.COMMENT_SERVICE
);

export const commentRoutes = (fastify: FastifyInstance) => {
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
        handleCreateComment(commentService)
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
        handleGetComment(commentService)
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
        handleUpdateComment(commentService)
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
        handleDeleteComment(commentService)
    );
};
