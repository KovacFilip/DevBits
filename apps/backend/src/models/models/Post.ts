export type PostModel = {
    id: string;
    title: string;
    content: string;
    userId: string;
};

export type CreatePostModel = {
    title: string;
    content: string;
    userId: string;
};

export type UpdatePostModel = {
    title?: string;
    content?: string;
};

export type PostIdModel = string;
