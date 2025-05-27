import { container } from 'apps/backend/src/config/inversify.config';
import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { createHandleCreateComment } from 'apps/backend/src/controllers/CommentController/Factories/CreateHandleCreateComment';
import { createHandleDeleteComment } from 'apps/backend/src/controllers/CommentController/Factories/CreateHandleDeleteComment';
import { createHandleGetComment } from 'apps/backend/src/controllers/CommentController/Factories/CreateHandleGetComment';
import { createHandleUpdateComment } from 'apps/backend/src/controllers/CommentController/Factories/CreateHandleUpdateComment';
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
    const handleCreateComment = createHandleCreateComment(commentService);
    const handleGetComment = createHandleGetComment(commentService);
    const handleUpdateComment = createHandleUpdateComment(commentService);
    const handleDeleteComment = createHandleDeleteComment(commentService);

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
        handleCreateComment
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
        handleGetComment
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
        handleUpdateComment
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
        handleDeleteComment
    );
};
