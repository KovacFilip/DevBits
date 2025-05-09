import {
    CommentDTO,
    CommentIdDTO,
    CreateCommentDTO,
    PostIdDTO,
    UpdateCommentDTO,
    UserIdDTO,
} from 'packages/shared';

export interface ICommentService {
    createComment(dto: CreateCommentDTO): Promise<CommentDTO>;

    getComment(dto: CommentIdDTO): Promise<CommentDTO>;
    getCommentsForPost(dto: PostIdDTO): Promise<CommentDTO[]>;
    getCommentsByUser(dto: UserIdDTO): Promise<CommentDTO[]>;

    updateComment(dto: UpdateCommentDTO): Promise<CommentDTO>;

    deleteComment(dto: CommentIdDTO): Promise<CommentDTO>;
}
