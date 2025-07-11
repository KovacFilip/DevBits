import { Prisma } from 'apps/backend/prisma/generated/client';
import {
    LOGGER,
    REPOSITORY_IDENTIFIER,
} from 'apps/backend/src/constants/identifiers';
import { NotFoundError } from 'apps/backend/src/errors/NotFoundError';
import { logServiceErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
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
            const createLikeInput: Prisma.LikeCreateInput = {
                user: {
                    connect: {
                        userId: user.userId,
                    },
                },
                post: {
                    connect: {
                        postId: post.postId,
                    },
                },
            };

            const like = await this.likeRepository.createLike(createLikeInput);

            return {
                likeId: like.likeId,
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
            const createLikeInput: Prisma.LikeCreateInput = {
                user: {
                    connect: {
                        userId: user.userId,
                    },
                },
                comment: {
                    connect: {
                        commentId: comment.commentId,
                    },
                },
            };

            const like = await this.likeRepository.createLike(createLikeInput);

            return {
                likeId: like.likeId,
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
            const likeUniqueInput: Prisma.LikeWhereUniqueInput = {
                likeId: dto.likeId,
            };

            const like = await this.likeRepository.readLike(likeUniqueInput);

            if (!like) {
                throw new NotFoundError(
                    `Like with id: ${dto.likeId} was not found`
                );
            }

            if (like.postId) {
                return {
                    likeId: like.likeId,
                    user: {
                        userId: like.userId,
                    },
                    post: {
                        postId: like.postId!,
                    },
                };
            }

            return {
                likeId: like.likeId,
                user: {
                    userId: like.userId,
                },
                comment: {
                    commentId: like.commentId!,
                },
            };
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
            const likeUniqueInput: Prisma.LikeWhereUniqueInput = {
                likeId: dto.likeId,
            };

            const removedLike =
                await this.likeRepository.softDeleteLike(likeUniqueInput);

            return {
                likeId: removedLike.likeId,
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
            const postUniqueInput: Prisma.PostWhereUniqueInput = {
                postId: dto.postId,
            };

            const likes =
                await this.likeRepository.readLikesPerPost(postUniqueInput);

            return likes.map((like) => {
                return {
                    likeId: like.likeId,
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
            const commentUniqueInput: Prisma.CommentWhereUniqueInput = {
                commentId: dto.commentId,
            };

            const likes =
                await this.likeRepository.readLikesPerComment(
                    commentUniqueInput
                );

            return likes.map((like) => {
                return {
                    likeId: like.likeId,
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
            const postUniqueInput: Prisma.PostWhereUniqueInput = {
                postId: dto.postId,
            };

            return await this.likeRepository.readNumberOfLikesPerPost(
                postUniqueInput
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
            const commentUniqueInput: Prisma.CommentWhereUniqueInput = {
                commentId: dto.commentId,
            };

            return await this.likeRepository.readNumberOfLikesPerComment(
                commentUniqueInput
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
