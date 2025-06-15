import { SERVICE_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
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

@injectable()
export class LikeController implements ILikeController {
    constructor(
        @inject(SERVICE_IDENTIFIER.LIKE_SERVICE)
        readonly likeService: ILikeService
    ) {}

    async likePost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO }>
    ): Promise<void> {
        const like = await this.likeService.likePost(
            request.user,
            request.params
        );

        return response.code(StatusCodes.OK).send(like);
    }

    async likeComment(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO }>
    ): Promise<void> {
        const like = await this.likeService.likeComment(
            request.user,
            request.params
        );

        return response.code(StatusCodes.OK).send(like);
    }

    async getLike(
        request: FastifyRequest<{ Params: LikeIdDTO }>,
        response: FastifyReply<{ Reply: LikePostDTO | LikeCommentDTO }>
    ): Promise<void> {
        const like = await this.likeService.getLike(request.params);

        return response.code(StatusCodes.OK).send(like);
    }

    async getLikesForPost(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO[] }>
    ): Promise<void> {
        const likes = await this.likeService.getLikesForPost(request.params);

        return response.code(StatusCodes.OK).send(likes);
    }

    async getLikesForComment(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO[] }>
    ): Promise<void> {
        const likes = await this.likeService.getLikesForComment(request.params);

        return response.code(StatusCodes.OK).send(likes);
    }

    async getPostLikesCount(
        request: FastifyRequest<{ Params: PostIdDTO }>,
        response: FastifyReply<{ Reply: number }>
    ): Promise<void> {
        const count = await this.likeService.getNumberOfLikesOfPost(
            request.params
        );

        return response.code(StatusCodes.OK).send(count);
    }

    async getCommentLikesCount(
        request: FastifyRequest<{ Params: CommentIdDTO }>,
        response: FastifyReply<{ Reply: number }>
    ): Promise<void> {
        const count = await this.likeService.getNumberOfLikesOfComment(
            request.params
        );

        return response.code(StatusCodes.OK).send(count);
    }

    async deleteLike(
        request: FastifyRequest<{ Params: LikeIdDTO }>,
        response: FastifyReply<{ Reply: LikeIdDTO }>
    ): Promise<void> {
        const deletedLike = await this.likeService.removeLike(request.params);

        return response.code(StatusCodes.OK).send(deletedLike);
    }
}
