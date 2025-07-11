import {
    CommentIdModel,
    CommentModel,
    CreateCommentModel,
    UpdateCommentModel,
} from 'apps/backend/src/models/models/Comment';
import { PostIdModel } from 'apps/backend/src/models/models/Post';
import { UserIdModel } from 'apps/backend/src/models/models/User';

export interface ICommentRepository {
    createComment(comment: CreateCommentModel): Promise<CommentModel>;

    readComment(commentId: CommentIdModel): Promise<CommentModel | null>;

    readCommentForPost(postId: PostIdModel): Promise<CommentModel[] | null>;

    readCommentForUser(userId: UserIdModel): Promise<CommentModel[] | null>;

    updateComment(
        commentId: CommentIdModel,
        data: UpdateCommentModel
    ): Promise<CommentModel>;

    hardDeleteComment(commentId: CommentIdModel): Promise<CommentModel>;
    softDeleteComment(commentId: CommentIdModel): Promise<CommentModel>;
}
