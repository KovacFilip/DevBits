import {
    CommentDTO,
    CommentIdDTO,
    CreateCommentDTO,
    PostIdDTO,
    SimpleCommentDTO,
    UpdateCommentDTO,
    UserIdDTO,
} from 'packages/shared';

export interface ICommentService {
    createComment(
        UserIdDTO: UserIdDTO,
        dto: CreateCommentDTO
    ): Promise<CommentDTO>;

    getComment(dto: CommentIdDTO): Promise<CommentDTO>;
    getCommentsForPost(dto: PostIdDTO): Promise<SimpleCommentDTO[]>;
    getCommentsByUser(dto: UserIdDTO): Promise<SimpleCommentDTO[]>;

    updateComment(
        commentIdDto: CommentIdDTO,
        newCommentData: UpdateCommentDTO
    ): Promise<CommentDTO>;

    deleteComment(dto: CommentIdDTO): Promise<SimpleCommentDTO>;
}
