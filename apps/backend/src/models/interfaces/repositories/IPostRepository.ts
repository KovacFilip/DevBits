import {
    CreatePostModel,
    PostIdModel,
    PostModel,
    UpdatePostModel,
} from 'apps/backend/src/models/models/Post';
import { UserIdModel } from 'apps/backend/src/models/models/User';

export interface IPostRepository {
    createPost(post: CreatePostModel): Promise<PostModel>;

    readPost(postId: PostIdModel): Promise<PostModel | null>;
    readUsersPosts(userId: UserIdModel): Promise<PostModel[]>;

    updatePost(postId: PostIdModel, data: UpdatePostModel): Promise<PostModel>;

    hardDeletePost(postId: PostIdModel): Promise<PostModel>;
    softDeletePost(postId: PostIdModel): Promise<PostModel>;
}
