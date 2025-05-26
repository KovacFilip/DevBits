import {
    CreatePostDTO,
    PostIdDTO,
    PostSimpleDTO,
    PostWithContentDTO,
    UpdatePostDTO,
} from 'apps/backend/src/models/DTOs/PostDTO';
import { UserIdDTO } from 'apps/backend/src/models/DTOs/UserDTO';

export interface IPostService {
    // Create
    createPost(dto: CreatePostDTO): Promise<PostSimpleDTO>;

    // Read
    getPostById(dto: PostIdDTO): Promise<PostWithContentDTO>;
    getPostsByUser(dto: UserIdDTO): Promise<PostSimpleDTO[]>;

    // Update
    updatePost(dto: UpdatePostDTO): Promise<PostWithContentDTO>;

    // Delete
    deletePost(dto: PostIdDTO): Promise<PostSimpleDTO>;
}
