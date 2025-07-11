export type CommentModel = {
    id: string;
    postId: string;
    userId: string;
    parentCommentId?: string;
    content: string;
};

export type CreateCommentModel = {
    content: string;
    postId: string;
    userId: string;
    parentCommentId?: string;
};

export type UpdateCommentModel = {
    content: string;
};

export type CommentIdModel = string;
