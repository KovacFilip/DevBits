import { CommentIdDTO } from 'apps/backend/src/models/DTOs/CommentDTO';
import {
    CreateCommentLikeDTO,
    CreatePostLikeDTO,
    LikeCommentDTO,
    LikeIdDTO,
    LikePostDTO,
} from 'apps/backend/src/models/DTOs/LikeDTO';
import { PostIdDTO } from 'apps/backend/src/models/DTOs/PostDTO';

export interface ILikeService {
    likePost(dto: CreatePostLikeDTO): Promise<LikePostDTO>;
    likeComment(dto: CreateCommentLikeDTO): Promise<LikeCommentDTO>;

    getLike(dto: LikeIdDTO): Promise<LikePostDTO | LikeCommentDTO>;
    getLikesForPost(dto: PostIdDTO): Promise<LikePostDTO[]>;
    getLikesForComment(dto: CommentIdDTO): Promise<LikeCommentDTO[]>;
    getNumberOfLikesOfPost(dto: PostIdDTO): Promise<number>;
    getNumberOfLikesOfComment(dto: CommentIdDTO): Promise<number>;

    removeLike(dto: LikeIdDTO): Promise<LikePostDTO | LikeCommentDTO>;
}
