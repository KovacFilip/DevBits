import { CommentIdDTO } from './CommentDTO';
import { PostIdDTO } from './PostDTO';

export type LikePostDTO = {
    likeId: string;
    userId: string;
    post: PostIdDTO;
};

export type LikeCommentDTO = {
    likeId: string;
    userId: string;
    comment: CommentIdDTO;
};

export type CreateCommentLikeDTO = {
    userId: string;
    entity: CommentIdDTO;
};

export type CreatePostLikeDTO = {
    userId: string;
    entity: PostIdDTO;
};

export type LikeIdDTO = {
    likeId: string;
};
