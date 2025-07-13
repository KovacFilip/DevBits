import { Like } from 'apps/backend/prisma/generated/client';
import {
    LikeCommentModel,
    LikePostModel,
} from 'apps/backend/src/models/models/Like';

export const mapPrismaLikeCommentToLikeCommentModel = (
    prismaLike: Like
): LikeCommentModel => {
    return {
        id: prismaLike.likeId,
        userId: prismaLike.userId,
        commentId: prismaLike.commentId!,
    };
};

export const mapPrismaLikePostToLikePostModel = (
    prismaLike: Like
): LikePostModel => {
    return {
        id: prismaLike.likeId,
        userId: prismaLike.userId,
        postId: prismaLike.postId!,
    };
};
