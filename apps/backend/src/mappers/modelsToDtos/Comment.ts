import { CommentModel } from 'apps/backend/src/models/models/Comment';
import { CommentDTO } from 'packages/shared';

export const mapCommentModelToCommentDTO = (
    commentModel: CommentModel
): CommentDTO => {
    return {
        commentId: commentModel.id,
        content: commentModel.content,
        postId: commentModel.postId,
        userId: commentModel.userId,
        parentCommentId: commentModel.parentCommentId,
    };
};
