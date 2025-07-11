import { Post } from 'apps/backend/prisma/generated/client';
import { PostModel } from 'apps/backend/src/models/models/Post';

export const mapPrismaPostToPostModel = (prismaPost: Post): PostModel => {
    return {
        id: prismaPost.postId,
        title: prismaPost.title,
        content: prismaPost.content,
        userId: prismaPost.userId,
    };
};
