import { Comment } from 'apps/backend/prisma/generated/client';
import { CommentModel } from 'apps/backend/src/models/models/Comment';

export const mapPrismaCommentToCommentModel = (
    prismaComment: Comment
): CommentModel => {
    return {
        id: prismaComment.postId,
        userId: prismaComment.userId,
        postId: prismaComment.postId,
        parentCommentId: prismaComment.parentCommentId ?? undefined,
        content: prismaComment.content,
    };
};
