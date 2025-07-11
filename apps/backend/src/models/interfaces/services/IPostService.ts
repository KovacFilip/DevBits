import {
    CreatePostDTO,
    PostIdDTO,
    PostSimpleDTO,
    PostWithContentDTO,
    UpdatePostDTO,
    UserIdDTO,
} from 'packages/shared';

export interface IPostService {
    createPost(
        user: UserIdDTO,
        createPost: CreatePostDTO
    ): Promise<PostWithContentDTO>;

    getPostById(dto: PostIdDTO): Promise<PostWithContentDTO>;
    getPostsByUser(dto: UserIdDTO): Promise<PostSimpleDTO[]>;

    updatePost(
        postIdDto: PostIdDTO,
        updatePostDto: UpdatePostDTO
    ): Promise<PostWithContentDTO>;

    deletePost(dto: PostIdDTO): Promise<PostSimpleDTO>;
}
