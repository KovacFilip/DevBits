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

export interface ILikeRepository {
    createLikeOnPost(like: CreateLikeOnPostModel): Promise<LikeIdModel>;
    createLikeOnComment(like: CreateLikeOnCommentModel): Promise<LikeIdModel>;

    readLike(like: LikeIdModel): Promise<LikeModel | null>;

    readLikesPerPost(post: PostIdModel): Promise<LikePostModel[]>;

    readNumberOfLikesPerPost(post: PostIdModel): Promise<number>;

    readLikesPerComment(comment: CommentIdModel): Promise<LikeCommentModel[]>;

    readNumberOfLikesPerComment(comment: CommentIdModel): Promise<number>;

    readLikesByUser(user: UserIdModel): Promise<LikeIdModel[]>;

    hardDeleteLike(like: LikeIdModel): Promise<LikeIdModel>;
    softDeleteLike(like: LikeIdModel): Promise<LikeIdModel>;
}
