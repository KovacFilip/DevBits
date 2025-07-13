import {
    LOGGER,
    REPOSITORY_IDENTIFIER,
} from 'apps/backend/src/constants/identifiers';
import { NotFoundError } from 'apps/backend/src/errors/NotFoundError';
import { logServiceErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import { isLikeCommentModel } from 'apps/backend/src/helpers/typeChecks';
import {
    mapLikeCommentModelToLikeCommentDTO,
    mapLikePostModelToLikePostDTO,
} from 'apps/backend/src/mappers/modelsToDtos/Like';
import { ILikeRepository } from 'apps/backend/src/models/interfaces/repositories/ILikeRepository';
import { ILikeService } from 'apps/backend/src/models/interfaces/services/ILikeService';
import { inject, injectable } from 'inversify';
import {
    CommentIdDTO,
    LikeCommentDTO,
    LikeIdDTO,
    LikePostDTO,
    PostIdDTO,
    UserIdDTO,
} from 'packages/shared';
import { Logger } from 'pino';

@injectable()
export class LikeService implements ILikeService {
    constructor(
        @inject(REPOSITORY_IDENTIFIER.LIKE_REPOSITORY)
        private readonly likeRepository: ILikeRepository,
        @inject(LOGGER.LOGGER) private readonly logger: Logger
    ) {}

    async likePost(user: UserIdDTO, post: PostIdDTO): Promise<LikeIdDTO> {
        try {
            const likeId = await this.likeRepository.createLikeOnPost({
                postId: post.postId,
                userId: user.userId,
            });

            return {
                likeId,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { user, post },
                service: 'LikeService',
                method: 'likePost',
            });

            throw err;
        }
    }

    async likeComment(
        user: UserIdDTO,
        comment: CommentIdDTO
    ): Promise<LikeIdDTO> {
        try {
            const likeId = await this.likeRepository.createLikeOnComment({
                userId: user.userId,
                commentId: comment.commentId,
            });

            return {
                likeId,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { user, comment },
                service: 'LikeService',
                method: 'likeComment',
            });

            throw err;
        }
    }

    async getLike(dto: LikeIdDTO): Promise<LikePostDTO | LikeCommentDTO> {
        try {
            const like = await this.likeRepository.readLike(dto.likeId);

            if (!like) {
                throw new NotFoundError(
                    `Like with id: ${dto.likeId} was not found`
                );
            }

            if (isLikeCommentModel(like)) {
                return mapLikeCommentModelToLikeCommentDTO(like);
            }

            return mapLikePostModelToLikePostDTO(like);
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'LikeService',
                method: 'getLike',
            });

            throw err;
        }
    }

    async removeLike(dto: LikeIdDTO): Promise<LikeIdDTO> {
        try {
            const removedLikeId = await this.likeRepository.softDeleteLike(
                dto.likeId
            );

            return {
                likeId: removedLikeId,
            };
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'LikeService',
                method: 'removeLike',
            });

            throw err;
        }
    }

    async getLikesForPost(dto: PostIdDTO): Promise<LikeIdDTO[]> {
        try {
            const likes = await this.likeRepository.readLikesPerPost(
                dto.postId
            );

            return likes.map((like) => {
                return {
                    likeId: like.id,
                };
            });
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'LikeService',
                method: 'getLikesForPost',
            });

            throw err;
        }
    }

    async getLikesForComment(dto: CommentIdDTO): Promise<LikeIdDTO[]> {
        try {
            const likes = await this.likeRepository.readLikesPerComment(
                dto.commentId
            );

            return likes.map((like) => {
                return {
                    likeId: like.id,
                };
            });
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'LikeService',
                method: 'getLikesForComment',
            });

            throw err;
        }
    }

    async getNumberOfLikesOfPost(dto: PostIdDTO): Promise<number> {
        try {
            return await this.likeRepository.readNumberOfLikesPerPost(
                dto.postId
            );
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'LikeService',
                method: 'getNumberOfLikesOfPost',
            });

            throw err;
        }
    }

    async getNumberOfLikesOfComment(dto: CommentIdDTO): Promise<number> {
        try {
            return await this.likeRepository.readNumberOfLikesPerComment(
                dto.commentId
            );
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'LikeService',
                method: 'getNumberOfLikesOfComment',
            });

            throw err;
        }
    }
}
