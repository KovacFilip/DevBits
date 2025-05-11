import { FastifyInstance } from 'fastify';
import {
    CommentIdParams,
    commentIdSchema,
    CreateCommentRequest,
    createCommentSchema,
    GetCommentRequest,
    getCommentSchema,
    updateCommentBodySchema,
    UpdateCommentDTO,
    UpdateCommentRequestBody,
} from 'packages/shared';
import { container } from '../config/inversify.config';
import { SERVICE_IDENTIFIER } from '../constants/identifiers';
import { ICommentService } from '../models/interfaces/services/ICommentService';

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
                body: createCommentSchema,
            },
        },
        async (request, response) => {
            const user = request.user;

            const newComment = await commentService.createComment({
                userId: user.userId,
                ...request.body,
            });

            return response.code(200).send({ success: true, newComment });
        }
    );

    // Get Comment
    fastify.get<{ Querystring: GetCommentRequest }>(
        BASE_COMMENT_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                querystring: getCommentSchema,
            },
        },
        async (request, response) => {
            const { commentId, postId, userId } = request.query;

            if (commentId) {
                const comment = await commentService.getComment({ commentId });
                return response.code(200).send({ success: true, comment });
            }

            if (postId) {
                const comments = await commentService.getCommentsForPost({
                    postId,
                });
                return response.code(200).send({ success: true, comments });
            }

            if (userId) {
                const comments = await commentService.getCommentsByUser({
                    userId,
                });
                return response.code(200).send({ success: true, comments });
            }

            return response.code(400).send({
                success: false,
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

            return response.code(200).send({ success: true, updatedComment });
        }
    );

    // Delete Comment
    fastify.delete<{ Querystring: CommentIdParams }>(
        BASE_COMMENT_ROUTE,
        {
            preHandler: [fastify.authenticate],
            schema: {
                querystring: commentIdSchema,
            },
        },
        async (request, response) => {
            const deletedComment = await commentService.deleteComment(
                request.query
            );

            return response.code(200).send({ success: true, deletedComment });
        }
    );
};
