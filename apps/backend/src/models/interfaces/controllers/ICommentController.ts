import { FastifyReply, FastifyRequest } from 'fastify';
import {
    CommentDTO,
    CommentIdDTO,
    CreateCommentDTO,
    PostIdDTO,
    SimpleCommentDTO,
    UpdateCommentDTO,
    UserIdDTO,
} from 'packages/shared';

export interface ICommentController {
    createComment(
        request: FastifyRequest<{ Body: CreateCommentDTO }>,
        response: FastifyReply<{ Reply: CommentDTO }>
    ): Promise<void>;

    getComment(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: CommentDTO }>
    ): Promise<void>;

    getCommentsForPost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: SimpleCommentDTO[] }>
    ): Promise<void>;

    getCommentsByUser(
        request: FastifyRequest<{ Params: UserIdDTO }>,
        response: FastifyReply<{ Reply: SimpleCommentDTO[] }>
    ): Promise<void>;

    updateComment(
        request: FastifyRequest<{
            Body: UpdateCommentDTO;
            Params: CommentIdDTO;
        }>,
        response: FastifyReply<{ Reply: CommentDTO }>
    ): Promise<void>;

    deleteComment(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: SimpleCommentDTO }>
    ): Promise<void>;
}
