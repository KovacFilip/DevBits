import { Prisma } from 'apps/backend/prisma/generated/client';
import { REPOSITORY_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { NotFoundError } from 'apps/backend/src/errors/NotFoundError';
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

@injectable()
export class LikeService implements ILikeService {
    constructor(
        @inject(REPOSITORY_IDENTIFIER.LIKE_REPOSITORY)
        private readonly likeRepository: ILikeRepository
    ) {}

    async likePost(user: UserIdDTO, post: PostIdDTO): Promise<LikeIdDTO> {
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
    }

    async likeComment(
        user: UserIdDTO,
        comment: CommentIdDTO
    ): Promise<LikeIdDTO> {
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
    }

    async getLike(dto: LikeIdDTO): Promise<LikePostDTO | LikeCommentDTO> {
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
    }

    async removeLike(dto: LikeIdDTO): Promise<LikeIdDTO> {
        const likeUniqueInput: Prisma.LikeWhereUniqueInput = {
            likeId: dto.likeId,
        };

        const removedLike =
            await this.likeRepository.softDeleteLike(likeUniqueInput);

        return {
            likeId: removedLike.likeId,
        };
    }

    async getLikesForPost(dto: PostIdDTO): Promise<LikeIdDTO[]> {
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
    }

    async getLikesForComment(dto: CommentIdDTO): Promise<LikeIdDTO[]> {
        const commentUniqueInput: Prisma.CommentWhereUniqueInput = {
            commentId: dto.commentId,
        };

        const likes =
            await this.likeRepository.readLikesPerComment(commentUniqueInput);

        return likes.map((like) => {
            return {
                likeId: like.likeId,
            };
        });
    }

    async getNumberOfLikesOfPost(dto: PostIdDTO): Promise<number> {
        const postUniqueInput: Prisma.PostWhereUniqueInput = {
            postId: dto.postId,
        };

        return await this.likeRepository.readNumberOfLikesPerPost(
            postUniqueInput
        );
    }

    async getNumberOfLikesOfComment(dto: CommentIdDTO): Promise<number> {
        const commentUniqueInput: Prisma.CommentWhereUniqueInput = {
            commentId: dto.commentId,
        };

        return await this.likeRepository.readNumberOfLikesPerComment(
            commentUniqueInput
        );
    }
}
