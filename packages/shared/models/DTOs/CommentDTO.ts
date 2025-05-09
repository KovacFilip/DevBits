export type CommentDTO = {
    commentId: string;
    postId: string;
    userId: string;
    parentCommentId?: string;
    content: string;
};

export type CreateCommentDTO = {
    postId: string;
    userId: string;
    parentCommentId?: string;
    content: string;
};

export type CommentIdDTO = {
    commentId: string;
};

export type UpdateCommentDTO = {
    commentId: string;
    updateData: {
        content: string;
    };
};
