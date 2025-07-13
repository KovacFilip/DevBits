export type LikeCommentModel = {
    id: string;
    userId: string;
    commentId: string;
};

export type LikePostModel = {
    id: string;
    userId: string;
    postId: string;
};

export type LikeModel = LikeCommentModel | LikePostModel;

export type CreateLikeOnCommentModel = {
    userId: string;
    commentId: string;
};

export type CreateLikeOnPostModel = {
    userId: string;
    postId: string;
};

export type LikeIdModel = string;
