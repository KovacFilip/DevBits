export type PostSimpleDTO = {
    postId: string;
    userId: string;
    title: string;
};

export type PostWithContentDTO = {
    postId: string;
    userId: string;
    title: string;
    content: string;
};

export type CreatePostDTO = {
    userId: string;
    title: string;
    content: string;
};

export type UpdatePostDTO = {
    postId: string;
    updateData: {
        title?: string;
        content?: string;
    };
};

export type PostIdDTO = {
    postId: string;
};
