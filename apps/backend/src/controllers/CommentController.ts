import { FastifyInstance } from 'fastify';
import {
    CommentIdDTO,
    CreateCommentDTO,
    UpdateCommentDTO,
} from 'packages/shared';
import { GetCommentQueryDTO } from '../models/GetCommentQueryDTO';
import { CommentService } from '../services/CommentService';

export const BASE_COMMENT_ROUTE = '/comment';

const commentService = new CommentService();

export const commentRoutes = (fastify: FastifyInstance) => {
    // Create Comment
    fastify.post<{ Body: Omit<CreateCommentDTO, 'userId'> }>(
        BASE_COMMENT_ROUTE,
        async (request, response) => {
            // UserID - TODO: should be taken from auth header
            const userId = 'bd1c8f1a-5a1a-48b0-a2a1-dd7ebd742fe1';

            const newComment = await commentService.createComment({
                userId,
                ...request.body,
            });

            return response.code(200).send({ success: true, newComment });
        }
    );

    // Get Comment
    fastify.get<{ Querystring: GetCommentQueryDTO }>(
        BASE_COMMENT_ROUTE,
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
    fastify.put<{ Body: UpdateCommentDTO }>(
        BASE_COMMENT_ROUTE,
        async (request, response) => {
            const updatedComment = await commentService.updateComment(
                request.body
            );

            return response.code(200).send({ success: true, updatedComment });
        }
    );

    // Delete Comment
    fastify.delete<{ Querystring: CommentIdDTO }>(
        BASE_COMMENT_ROUTE,
        async (request, response) => {
            const deletedComment = await commentService.deleteComment(
                request.query
            );

            return response.code(200).send({ success: true, deletedComment });
        }
    );
};
