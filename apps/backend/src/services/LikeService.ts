import { Prisma } from 'apps/backend/prisma/generated/client';
import { inject, injectable } from 'inversify';
import {
    CommentIdDTO,
    CreateCommentLikeDTO,
    CreatePostLikeDTO,
    LikeCommentDTO,
    LikeIdDTO,
    LikePostDTO,
    PostIdDTO,
} from 'packages/shared';
import { REPOSITORY_IDENTIFIER } from '../constants/identifiers';
import { NotFoundError } from '../errors/NotFoundError';
import { ILikeRepository } from '../models/interfaces/ILikeRepository';
import { ILikeService } from '../models/interfaces/services/ILikeService';

@injectable()
export class LikeService implements ILikeService {
    constructor(
        @inject(REPOSITORY_IDENTIFIER.LIKE_REPOSITORY)
        private readonly likeRepository: ILikeRepository
    ) {}

    async likePost(dto: CreatePostLikeDTO): Promise<LikePostDTO> {
        const createLikeInput: Prisma.LikeCreateInput = {
            user: {
                connect: {
                    userId: dto.userId,
                },
            },
            post: {
                connect: {
                    postId: dto.entity.postId,
                },
            },
        };

        const like = await this.likeRepository.createLike(createLikeInput);

        return {
            likeId: like.likeId,
            userId: like.userId,
            post: {
                postId: like.postId!,
            },
        };
    }

    async likeComment(dto: CreateCommentLikeDTO): Promise<LikeCommentDTO> {
        const createLikeInput: Prisma.LikeCreateInput = {
            user: {
                connect: {
                    userId: dto.userId,
                },
            },
            comment: {
                connect: {
                    commentId: dto.entity.commentId,
                },
            },
        };

        const like = await this.likeRepository.createLike(createLikeInput);

        return {
            likeId: like.likeId,
            userId: like.userId,
            comment: {
                commentId: like.commentId!, // Here it should be ok with the '!', since the like is going to a post
            },
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
                userId: like.userId,
                post: {
                    postId: like.postId!,
                },
            };
        }

        return {
            likeId: like.likeId,
            userId: like.userId,
            comment: {
                commentId: like.commentId!,
            },
        };
    }

    async removeLike(dto: LikeIdDTO): Promise<LikePostDTO | LikeCommentDTO> {
        const likeUniqueInput: Prisma.LikeWhereUniqueInput = {
            likeId: dto.likeId,
        };

        const removedLike =
            await this.likeRepository.softDeleteLike(likeUniqueInput);

        if (removedLike.postId) {
            return {
                likeId: removedLike.likeId,
                userId: removedLike.userId,
                post: {
                    postId: removedLike.postId!,
                },
            };
        }

        return {
            likeId: removedLike.likeId,
            userId: removedLike.userId,
            comment: {
                commentId: removedLike.commentId!,
            },
        };
    }

    async getLikesForPost(dto: PostIdDTO): Promise<LikePostDTO[]> {
        const postUniqueInput: Prisma.PostWhereUniqueInput = {
            postId: dto.postId,
        };

        const likes =
            await this.likeRepository.readLikesPerPost(postUniqueInput);

        return likes.map((like) => {
            return {
                likeId: like.likeId,
                userId: like.userId,
                post: {
                    postId: like.postId!,
                },
            };
        });
    }

    async getLikesForComment(dto: CommentIdDTO): Promise<LikeCommentDTO[]> {
        const commentUniqueInput: Prisma.CommentWhereUniqueInput = {
            commentId: dto.commentId,
        };

        const likes =
            await this.likeRepository.readLikesPerComment(commentUniqueInput);

        return likes.map((like) => {
            return {
                likeId: like.likeId,
                userId: like.userId,
                comment: {
                    commentId: like.commentId!,
                },
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
