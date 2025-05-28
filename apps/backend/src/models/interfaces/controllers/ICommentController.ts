import { FastifyReply, FastifyRequest } from 'fastify';
import {
    CommentIdParams,
    CreateCommentRequest,
    GetCommentRequest,
    UpdateCommentRequestBody,
} from 'packages/shared';

export interface ICommentController {
    createComment(
        request: FastifyRequest<{ Body: CreateCommentRequest }>,
        response: FastifyReply
    ): Promise<void>;

    getComment(
        request: FastifyRequest<{ Querystring: GetCommentRequest }>,
        response: FastifyReply
    ): Promise<void>;

    updateComment(
        request: FastifyRequest<{
            Body: UpdateCommentRequestBody;
            Querystring: CommentIdParams;
        }>,
        response: FastifyReply
    ): Promise<void>;

    deleteComment(
        request: FastifyRequest<{ Querystring: CommentIdParams }>,
        response: FastifyReply
    ): Promise<void>;
}
