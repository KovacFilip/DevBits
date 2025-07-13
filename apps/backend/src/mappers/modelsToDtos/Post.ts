import { PostModel } from 'apps/backend/src/models/models/Post';
import { PostSimpleDTO, PostWithContentDTO } from 'packages/shared';

export const mapPostModelToPostSimpleDTO = (
    postModel: PostModel
): PostSimpleDTO => {
    return {
        postId: postModel.id,
        title: postModel.title,
        userId: postModel.userId,
    };
};

export const mapPostModelToPostWithContentDTO = (
    postModel: PostModel
): PostWithContentDTO => {
    return {
        postId: postModel.id,
        title: postModel.title,
        content: postModel.content,
        userId: postModel.userId,
    };
};
