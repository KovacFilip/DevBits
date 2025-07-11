import {
    Like,
    Prisma,
    PrismaClient,
} from 'apps/backend/prisma/generated/client';
import {
    DATABASE_IDENTIFIER,
    LOGGER,
} from 'apps/backend/src/constants/identifiers';
import { EntityAlreadyDeletedError } from 'apps/backend/src/errors/RepositoryErrors/EntityAlreadyDeletedError';
import { EntityNotFoundError } from 'apps/backend/src/errors/RepositoryErrors/EntityNotFoundError';
import { logRepositoryErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import { ILikeRepository } from 'apps/backend/src/models/interfaces/repositories/ILikeRepository';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';

@injectable()
export class LikeRepository implements ILikeRepository {
    constructor(
        @inject(DATABASE_IDENTIFIER.PRISMA)
        private readonly prisma: PrismaClient,
        @inject(LOGGER.LOGGER) private readonly logger: Logger
    ) {}

    createLike(like: Prisma.LikeCreateInput): Promise<Like> {
        try {
            return this.prisma.like.create({
                data: like,
            });
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

    readLike(like: Prisma.LikeWhereUniqueInput): Promise<Like | null> {
        try {
            return this.prisma.like.findUnique({
                where: {
                    ...like,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'readLike',
                functionInput: { like },
            });

            throw err;
        }
    }

    readLikesPerPost(post: Prisma.PostWhereUniqueInput): Promise<Like[]> {
        try {
            return this.prisma.like.findMany({
                where: {
                    post,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'readLikesPerPost',
                functionInput: { post },
            });

            throw err;
        }
    }

    readNumberOfLikesPerPost(
        post: Prisma.PostWhereUniqueInput
    ): Promise<number> {
        try {
            return this.prisma.like.count({
                where: {
                    post,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'readNumberOfLikesPerPost',
                functionInput: { post },
            });

            throw err;
        }
    }

    readLikesPerComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Like[]> {
        try {
            return this.prisma.like.findMany({
                where: {
                    comment,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'readLikesPerComment',
                functionInput: { comment },
            });

            throw err;
        }
    }

    readNumberOfLikesPerComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<number> {
        try {
            return this.prisma.like.count({
                where: {
                    comment,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'readNumberOfLikesPerComment',
                functionInput: { comment },
            });

            throw err;
        }
    }

    readLikesByUser(user: Prisma.UserWhereUniqueInput): Promise<Like[]> {
        try {
            return this.prisma.like.findMany({
                where: {
                    user,
                    deletedAt: null,
                },
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'readLikesByUser',
                functionInput: { user },
            });

            throw err;
        }
    }

    updateLike(
        where: Prisma.LikeWhereUniqueInput,
        data: Prisma.LikeUpdateInput
    ): Promise<Like> {
        try {
            return this.prisma.$transaction(async (tx) => {
                const existingLike = await tx.like.findUnique({
                    where: { ...where, deletedAt: null },
                });

                if (!existingLike) {
                    throw new EntityNotFoundError(
                        'Like',
                        where.likeId as string
                    );
                }

                return tx.like.update({
                    where,
                    data,
                });
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'updateLike',
                functionInput: { where, data },
            });

            throw err;
        }
    }

    hardDeleteLike(like: Prisma.LikeWhereUniqueInput): Promise<Like> {
        try {
            return this.prisma.$transaction(async (tx) => {
                const existingLike = await tx.like.findUnique({
                    where: { ...like, deletedAt: null },
                });

                if (!existingLike) {
                    throw new EntityNotFoundError(
                        'Like',
                        like.likeId as string
                    );
                }

                return this.prisma.like.delete({
                    where: like,
                });
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'hardDeleteLike',
                functionInput: { like },
            });

            throw err;
        }
    }

    softDeleteLike(like: Prisma.LikeWhereUniqueInput): Promise<Like> {
        try {
            return this.prisma.$transaction(async (tx) => {
                const existingLike = await tx.like.findUnique({
                    where: { ...like, deletedAt: null },
                });

                if (!existingLike) {
                    throw new EntityNotFoundError(
                        'Like',
                        like.likeId as string
                    );
                }

                if (existingLike.deletedAt !== null) {
                    throw new EntityAlreadyDeletedError(
                        'Like',
                        like.likeId as string
                    );
                }

                return this.prisma.like.update({
                    where: like,
                    data: {
                        deletedAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
            });
        } catch (err) {
            logRepositoryErrorTrace({
                logger: this.logger,
                repository: 'LikeRepository',
                method: 'softDeleteLike',
                functionInput: { like },
            });

            throw err;
        }
    }
}
