import {
    CommentDTO,
    CommentIdDTO,
    CreateCommentDTO,
    UpdateCommentDTO,
} from 'apps/backend/src/models/DTOs/CommentDTO';
import { PostIdDTO } from 'apps/backend/src/models/DTOs/PostDTO';
import { UserIdDTO } from 'apps/backend/src/models/DTOs/UserDTO';

export interface ICommentService {
    createComment(dto: CreateCommentDTO): Promise<CommentDTO>;

    getComment(dto: CommentIdDTO): Promise<CommentDTO>;
    getCommentsForPost(dto: PostIdDTO): Promise<CommentDTO[]>;
    getCommentsByUser(dto: UserIdDTO): Promise<CommentDTO[]>;

    updateComment(dto: UpdateCommentDTO): Promise<CommentDTO>;

    deleteComment(dto: CommentIdDTO): Promise<CommentDTO>;
}
