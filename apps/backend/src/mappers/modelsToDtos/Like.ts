import {
    LikeCommentModel,
    LikePostModel,
} from 'apps/backend/src/models/models/Like';
import { LikeCommentDTO, LikePostDTO } from 'packages/shared';

export const mapLikeCommentModelToLikeCommentDTO = (
    likeModel: LikeCommentModel
): LikeCommentDTO => {
    return {
        likeId: likeModel.id,
        comment: {
            commentId: likeModel.commentId,
        },
        user: {
            userId: likeModel.userId,
        },
    };
};

export const mapLikePostModelToLikePostDTO = (
    likeModel: LikePostModel
): LikePostDTO => {
    return {
        likeId: likeModel.id,
        post: {
            postId: likeModel.postId,
        },
        user: {
            userId: likeModel.userId,
        },
    };
};
