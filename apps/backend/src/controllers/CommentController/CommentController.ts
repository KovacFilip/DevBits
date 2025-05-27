import { container } from 'apps/backend/src/config/inversify.config';
import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { UpdateCommentDTO } from 'apps/backend/src/models/DTOs/CommentDTO';
import { ICommentService } from 'apps/backend/src/models/interfaces/services/ICommentService';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
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
        async (request, response) => {
            const user = request.user;

            const newComment = await commentService.createComment({
                userId: user.userId,
                ...request.body,
            });

            return response.code(StatusCodes.OK).send({ newComment });
        }
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
        async (request, response) => {
            const { commentId, postId, userId } = request.query;

            if (commentId) {
                const comment = await commentService.getComment({ commentId });
                return response.code(StatusCodes.OK).send({ comment });
            }

            if (postId) {
                const comments = await commentService.getCommentsForPost({
                    postId,
                });
                return response.code(StatusCodes.OK).send({ comments });
            }

            if (userId) {
                const comments = await commentService.getCommentsByUser({
                    userId,
                });
                return response.code(StatusCodes.OK).send({ comments });
            }

            return response.code(400).send({
                message: 'Missing required query parameter.',
            });
        }
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
        async (request, response) => {
            const updateCommentDTO: UpdateCommentDTO = {
                commentId: request.query.commentId,
                updateData: {
                    content: request.body.content,
                },
            };

            const updatedComment =
                await commentService.updateComment(updateCommentDTO);

            return response.code(StatusCodes.OK).send({ updatedComment });
        }
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
        async (request, response) => {
            const deletedComment = await commentService.deleteComment(
                request.query
            );

            return response.code(StatusCodes.OK).send({ deletedComment });
        }
    );
};
