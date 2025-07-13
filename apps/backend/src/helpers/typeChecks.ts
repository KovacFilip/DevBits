import {
    LikeCommentModel,
    LikeModel,
    LikePostModel,
} from 'apps/backend/src/models/models/Like';

export const isLikeCommentModel = (
    like: LikeModel
): like is LikeCommentModel => {
    return (like as LikeCommentModel).commentId !== undefined;
};

export const isLikePostModel = (like: LikeModel): like is LikePostModel => {
    return (like as LikePostModel).postId !== undefined;
};
