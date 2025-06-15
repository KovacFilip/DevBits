import { FastifyReply, FastifyRequest } from 'fastify';
import {
    CommentIdDTO,
    LikeCommentDTO,
    LikeIdDTO,
    LikePostDTO,
    PostIdDTO,
} from 'packages/shared';

export interface ILikeController {
    likePost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO }>
    ): Promise<void>;

    likeComment(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO }>
    ): Promise<void>;

    getLike(
        request: FastifyRequest<{ Params: LikeIdDTO }>,
        response: FastifyReply<{ Reply: LikePostDTO | LikeCommentDTO }>
    ): Promise<void>;

    getLikesForPost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO[] }>
    ): Promise<void>;

    getLikesForComment(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO[] }>
    ): Promise<void>;

    getPostLikesCount(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: number }>
    ): Promise<void>;

    getCommentLikesCount(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: number }>
    ): Promise<void>;

    deleteLike(
        request: FastifyRequest<{ Params: LikeIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO }>
    ): Promise<void>;
}
