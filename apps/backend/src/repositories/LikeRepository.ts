import { Prisma, PrismaClient } from 'apps/backend/prisma/generated/client';
import {
    DATABASE_IDENTIFIER,
    LOGGER,
} from 'apps/backend/src/constants/identifiers';
import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { logRepositoryErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import {
    mapPrismaLikeCommentToLikeCommentModel,
    mapPrismaLikePostToLikePostModel,
} from 'apps/backend/src/mappers/prismaToModels/Like';
import { ILikeRepository } from 'apps/backend/src/models/interfaces/repositories/ILikeRepository';
import { CommentIdModel } from 'apps/backend/src/models/models/Comment';
import {
    CreateLikeOnCommentModel,
    CreateLikeOnPostModel,
    LikeCommentModel,
    LikeIdModel,
    LikeModel,
    LikePostModel,
} from 'apps/backend/src/models/models/Like';
import { PostIdModel } from 'apps/backend/src/models/models/Post';
import { UserIdModel } from 'apps/backend/src/models/models/User';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';

@injectable()
export class LikeRepository implements ILikeRepository {
    constructor(
        @inject(DATABASE_IDENTIFIER.PRISMA)
        private readonly prisma: PrismaClient,
        @inject(LOGGER.LOGGER) private readonly logger: Logger
    ) {}

    async createLikeOnComment(
        like: CreateLikeOnCommentModel
    ): Promise<LikeIdModel> {
        try {
            const createLikeInput: Prisma.LikeCreateInput = {
                user: {
                    connect: {
                        userId: like.userId,
                    },
                },
                comment: {
                    connect: {
                        commentId: like.commentId,
                    },
                },
            };

            const result = await this.prisma.like.create({
                data: createLikeInput,
            });

            return result.likeId;
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'createLike',
                functionInput: { like },
            });

            throw err;
        }
    }

    async createLikeOnPost(like: CreateLikeOnPostModel): Promise<LikeIdModel> {
        try {
            const createLikeInput: Prisma.LikeCreateInput = {
                user: {
                    connect: {
                        userId: like.userId,
                    },
                },
                post: {
                    connect: {
                        postId: like.postId,
                    },
                },
            };
            const result = await this.prisma.like.create({
                data: createLikeInput,
            });

            return result.likeId;
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'createLike',
                functionInput: { like },
            });

            throw err;
        }
    }

    async readLike(likeId: LikeIdModel): Promise<LikeModel | null> {
        try {
            const likeUniqueInput: Prisma.LikeWhereUniqueInput = {
                likeId: likeId,
                deletedAt: null,
            };

            const result = await this.prisma.like.findUnique({
                where: likeUniqueInput,
            });

            if (!result) {
                return null;
            }

            if (result?.commentId) {
                return mapPrismaLikeCommentToLikeCommentModel(result);
            }

            return mapPrismaLikePostToLikePostModel(result);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'readLike',
                functionInput: { likeId },
            });

            throw err;
        }
    }

    async readLikesPerPost(postId: PostIdModel): Promise<LikePostModel[]> {
        try {
            const result = await this.prisma.like.findMany({
                where: {
                    post: {
                        postId: postId,
                    },
                    deletedAt: null,
                },
            });

            return result.map((like) => mapPrismaLikePostToLikePostModel(like));
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'readLikesPerPost',
                functionInput: { postId },
            });

            throw err;
        }
    }

    readNumberOfLikesPerPost(postId: PostIdModel): Promise<number> {
        try {
            return this.prisma.like.count({
                where: {
                    postId,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'readNumberOfLikesPerPost',
                functionInput: { postId },
            });

            throw err;
        }
    }

    async readLikesPerComment(
        commentId: CommentIdModel
    ): Promise<LikeCommentModel[]> {
        try {
            const result = await this.prisma.like.findMany({
                where: {
                    comment: {
                        commentId,
                    },
                    deletedAt: null,
                },
            });

            return result.map((like) =>
                mapPrismaLikeCommentToLikeCommentModel(like)
            );
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'readLikesPerComment',
                functionInput: { commentId },
            });

            throw err;
        }
    }

    readNumberOfLikesPerComment(commentId: CommentIdModel): Promise<number> {
        try {
            return this.prisma.like.count({
                where: {
                    commentId,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'readNumberOfLikesPerComment',
                functionInput: { commentId },
            });

            throw err;
        }
    }

    async readLikesByUser(userId: UserIdModel): Promise<LikeIdModel[]> {
        try {
            const result = await this.prisma.like.findMany({
                where: {
                    user: {
                        userId,
                    },
                    deletedAt: null,
                },
            });

            return result.map((like) => like.likeId);
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'readLikesByUser',
                functionInput: { userId },
            });

            throw err;
        }
    }

    async hardDeleteLike(likeId: LikeIdModel): Promise<LikeIdModel> {
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                const existingLike = await tx.like.findUnique({
                    where: { likeId, deletedAt: null },
                });

                if (!existingLike) {
                    throw new EntityNotFoundError('Like', likeId);
                }

                return this.prisma.like.delete({
                    where: {
                        likeId,
                    },
                });
            });

            return result.likeId;
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'hardDeleteLike',
                functionInput: { likeId },
            });

            throw err;
        }
    }

    async softDeleteLike(likeId: LikeIdModel): Promise<LikeIdModel> {
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                const existingLike = await tx.like.findUnique({
                    where: { likeId, deletedAt: null },
                });

                if (!existingLike) {
                    throw new EntityNotFoundError('Like', likeId);
                }

                if (existingLike.deletedAt !== null) {
                    throw new EntityAlreadyDeletedError(
                        'Like',
                        likeId as string
                    );
                }

                return this.prisma.like.update({
                    where: {
                        likeId,
                    },
                    data: {
                        deletedAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
            });

            return result.likeId;
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'softDeleteLike',
                functionInput: { likeId },
            });

            throw err;
        }
    }
}
