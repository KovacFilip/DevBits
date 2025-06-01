import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { ILikeController } from 'apps/backend/src/models/interfaces/controllers/ILikeController';
import { ILikeService } from 'apps/backend/src/models/interfaces/services/ILikeService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import {
    createLikeRequest,
    GetCountOfLikesRequest,
    GetLikeRequest,
    LikeIdRequest,
} from 'packages/shared';

@injectable()
export class LikeController implements ILikeController {
    constructor(
        @inject(SERVICE_IDENTIFIER.LIKE_SERVICE)
        readonly likeService: ILikeService
    ) {}

    async createLike(
        request: FastifyRequest<{ Querystring: createLikeRequest }>,
        response: FastifyReply
    ): Promise<void> {
        const { commentId, postId } = request.query;
        const user = request.user;

        if (commentId) {
            const like = await this.likeService.likeComment({
                userId: user.userId,
                entity: { commentId },
            });
            return response.code(StatusCodes.OK).send({ like });
        }

        if (postId) {
            const like = await this.likeService.likePost({
                userId: user.userId,
                entity: { postId },
            });
            return response.code(StatusCodes.OK).send({ like });
        }

        return response.code(400).send({
            message: 'Missing required query parameter.',
        });
    }

    async getLike(
        request: FastifyRequest<{ Querystring: GetLikeRequest }>,
        response: FastifyReply
    ): Promise<void> {
        const { likeId, commentId, postId } = request.query;

        if (likeId) {
            const like = await this.likeService.getLike({ likeId });
            return response.code(StatusCodes.OK).send({ like });
        }

        if (commentId) {
            const likes = await this.likeService.getLikesForComment({
                commentId,
            });
            return response.code(StatusCodes.OK).send({ likes });
        }

        if (postId) {
            const likes = await this.likeService.getLikesForPost({ postId });
            return response.code(StatusCodes.OK).send({ likes });
        }

        return response.code(400).send({
            message: 'Missing required query parameter.',
        });
    }

    async getLikesCount(
        request: FastifyRequest<{ Querystring: GetCountOfLikesRequest }>,
        response: FastifyReply
    ): Promise<void> {
        const { commentId, postId } = request.query;

        if (commentId) {
            const count = await this.likeService.getNumberOfLikesOfComment({
                commentId,
            });
            return response.code(StatusCodes.OK).send({ count });
        }

        if (postId) {
            const count = await this.likeService.getNumberOfLikesOfPost({
                postId,
            });
            return response.code(StatusCodes.OK).send({ count });
        }

        return response.code(400).send({
            message: 'Missing required query parameter.',
        });
    }

    async deleteLike(
        request: FastifyRequest<{ Querystring: LikeIdRequest }>,
        response: FastifyReply
    ): Promise<void> {
        const deletedLike = await this.likeService.removeLike(request.query);

        return response.code(StatusCodes.OK).send({ deletedLike });
    }
}
