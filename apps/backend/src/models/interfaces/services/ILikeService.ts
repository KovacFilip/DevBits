import {
    CommentIdDTO,
    LikeCommentDTO,
    LikeIdDTO,
    LikePostDTO,
    PostIdDTO,
    UserIdDTO,
} from 'packages/shared';

export interface ILikeService {
    likePost(user: UserIdDTO, post: PostIdDTO): Promise<LikeIdDTO>;
    likeComment(user: UserIdDTO, comment: CommentIdDTO): Promise<LikeIdDTO>;

    getLike(dto: LikeIdDTO): Promise<LikePostDTO | LikeCommentDTO>;
    getLikesForPost(dto: PostIdDTO): Promise<LikeIdDTO[]>;
    getLikesForComment(dto: CommentIdDTO): Promise<LikeIdDTO[]>;
    getNumberOfLikesOfPost(dto: PostIdDTO): Promise<number>;
    getNumberOfLikesOfComment(dto: CommentIdDTO): Promise<number>;

    removeLike(dto: LikeIdDTO): Promise<LikeIdDTO>;
}
