import {
    LOGGER,
    SERVICE_IDENTIFIER,
} from 'apps/backend/src/constants/identifiers';
import { logControllerErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import { ILikeController } from 'apps/backend/src/models/interfaces/controllers/ILikeController';
import { ILikeService } from 'apps/backend/src/models/interfaces/services/ILikeService';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import {
    CommentIdDTO,
    LikeCommentDTO,
    LikeIdDTO,
    LikePostDTO,
    PostIdDTO,
} from 'packages/shared';
import { Logger } from 'pino';

@injectable()
export class LikeController implements ILikeController {
    constructor(
        @inject(SERVICE_IDENTIFIER.LIKE_SERVICE)
        readonly likeService: ILikeService,
        @inject(LOGGER.LOGGER) readonly logger: Logger
    ) {}

    async likePost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO }>
    ): Promise<void> {
        try {
            const like = await this.likeService.likePost(
                request.user,
                request.params
            );

            return response.code(StatusCodes.OK).send(like);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'LikeController',
                method: 'likePost',
            });

            throw err;
        }
    }

    async likeComment(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO }>
    ): Promise<void> {
        try {
            const like = await this.likeService.likeComment(
                request.user,
                request.params
            );

            return response.code(StatusCodes.OK).send(like);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'LikeController',
                method: 'likeComment',
            });

            throw err;
        }
    }

    async getLike(
        request: FastifyRequest<{ Params: LikeIdDTO }>,
        response: FastifyReply<{ Reply: LikePostDTO | LikeCommentDTO }>
    ): Promise<void> {
        try {
            const like = await this.likeService.getLike(request.params);

            return response.code(StatusCodes.OK).send(like);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'LikeController',
                method: 'getLike',
            });

            throw err;
        }
    }

    async getLikesForPost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO[] }>
    ): Promise<void> {
        try {
            const likes = await this.likeService.getLikesForPost(
                request.params
            );

            return response.code(StatusCodes.OK).send(likes);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'LikeController',
                method: 'getLikesForPost',
            });

            throw err;
        }
    }

    async getLikesForComment(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO[] }>
    ): Promise<void> {
        try {
            const likes = await this.likeService.getLikesForComment(
                request.params
            );

            return response.code(StatusCodes.OK).send(likes);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'LikeController',
                method: 'getLikesForComment',
            });

            throw err;
        }
    }

    async getPostLikesCount(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: number }>
    ): Promise<void> {
        try {
            const count = await this.likeService.getNumberOfLikesOfPost(
                request.params
            );

            return response.code(StatusCodes.OK).send(count);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'LikeController',
                method: 'getPostLikesCount',
            });

            throw err;
        }
    }

    async getCommentLikesCount(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: number }>
    ): Promise<void> {
        try {
            const count = await this.likeService.getNumberOfLikesOfComment(
                request.params
            );

            return response.code(StatusCodes.OK).send(count);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'LikeController',
                method: 'getCommentLikesCount',
            });

            throw err;
        }
    }

    async deleteLike(
        request: FastifyRequest<{ Params: LikeIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO }>
    ): Promise<void> {
        try {
            const deletedLike = await this.likeService.removeLike(
                request.params
            );

            return response.code(StatusCodes.OK).send(deletedLike);
        } catch (err) {
            logControllerErrorTrace({
                logger: this.logger,
                request,
                controller: 'LikeController',
                method: 'deleteLike',
            });

            throw err;
        }
    }
}
