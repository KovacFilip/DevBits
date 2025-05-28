import { FastifyReply, FastifyRequest } from 'fastify';
import {
    createLikeRequest,
    GetCountOfLikesRequest,
    GetLikeRequest,
    LikeIdRequest,
} from 'packages/shared';

export interface ILikeController {
    createLike(
        request: FastifyRequest<{ Querystring: createLikeRequest }>,
        response: FastifyReply
    ): Promise<void>;

    getLike(
        request: FastifyRequest<{ Querystring: GetLikeRequest }>,
        response: FastifyReply
    ): Promise<void>;

    getLikesCount(
        request: FastifyRequest<{ Querystring: GetCountOfLikesRequest }>,
        response: FastifyReply
    ): Promise<void>;

    deleteLike(
        request: FastifyRequest<{ Querystring: LikeIdRequest }>,
        response: FastifyReply
    ): Promise<void>;
}
