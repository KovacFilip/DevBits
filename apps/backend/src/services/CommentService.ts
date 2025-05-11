import { Prisma } from 'apps/backend/prisma/generated/client';
import { inject, injectable } from 'inversify';
import { REPOSITORY_IDENTIFIER } from '../constants/identifiers';
import { NotFoundError } from '../errors/NotFoundError';
import {
    CommentDTO,
    CommentIdDTO,
    CreateCommentDTO,
    UpdateCommentDTO,
} from '../models/DTOs/CommentDTO';
import { PostIdDTO } from '../models/DTOs/PostDTO';
import { UserIdDTO } from '../models/DTOs/UserDTO';
import { ICommentRepository } from '../models/interfaces/repositories/ICommentRepository';
import { ICommentService } from '../models/interfaces/services/ICommentService';

@injectable()
export class CommentService implements ICommentService {
    constructor(
        @inject(REPOSITORY_IDENTIFIER.COMMENT_REPOSITORY)
        private readonly commentRepository: ICommentRepository
    ) {}

    async createComment(dto: CreateCommentDTO): Promise<CommentDTO> {
        const commentToCreate: Prisma.CommentCreateInput = {
            user: { connect: { userId: dto.userId } },
            post: { connect: { postId: dto.postId } },
            content: dto.content,
            ...(dto.parentCommentId && {
                parentComment: {
                    connect: { commentId: dto.parentCommentId },
                },
            }),
        };

        const comment =
            await this.commentRepository.createComment(commentToCreate);

        return {
            commentId: comment.commentId,
            postId: comment.postId,
            userId: comment.userId,
            content: comment.content,
            parentCommentId: comment.parentCommentId ?? undefined,
        };
    }

    async getComment(dto: CommentIdDTO): Promise<CommentDTO> {
        const commentUniqueInput: Prisma.CommentWhereUniqueInput = {
            commentId: dto.commentId,
        };

        const comment =
            await this.commentRepository.readComment(commentUniqueInput);

        if (!comment) {
            throw new NotFoundError(
                `Unable to find comment with id: ${dto.commentId}`
            );
        }

        return {
            commentId: comment.commentId,
            postId: comment.postId,
            userId: comment.userId,
            content: comment.content,
            parentCommentId: comment.parentCommentId ?? undefined,
        };
    }

    async getCommentsForPost(dto: PostIdDTO): Promise<CommentDTO[]> {
        const uniquePostInput: Prisma.PostWhereUniqueInput = {
            postId: dto.postId,
        };

        const comments =
            await this.commentRepository.readCommentForPost(uniquePostInput);

        if (!comments) {
            throw new Error(
                `Comments for post with id: ${dto.postId} were not found`
            );
        }

        return comments.map((comment) => {
            return {
                commentId: comment.commentId,
                postId: comment.postId,
                userId: comment.userId,
                content: comment.content,
                parentCommentId: comment.parentCommentId ?? undefined,
            };
        });
    }

    async getCommentsByUser(dto: UserIdDTO): Promise<CommentDTO[]> {
        const uniqueUserInput: Prisma.UserWhereUniqueInput = {
            userId: dto.userId,
        };

        const comments =
            await this.commentRepository.readCommentForUser(uniqueUserInput);

        if (!comments) {
            throw new Error(
                `Comments for user with id: ${dto.userId} were not found`
            );
        }

        return comments.map((comment) => {
            return {
                commentId: comment.commentId,
                postId: comment.postId,
                userId: comment.userId,
                content: comment.content,
                parentCommentId: comment.parentCommentId ?? undefined,
            };
        });
    }

    async updateComment(dto: UpdateCommentDTO): Promise<CommentDTO> {
        const where: Prisma.CommentWhereUniqueInput = {
            commentId: dto.commentId,
        };

        const data: Prisma.CommentUpdateInput = {
            content: dto.updateData.content,
        };

        const updatedComment = await this.commentRepository.updateComment(
            where,
            data
        );

        return {
            commentId: updatedComment.commentId,
            userId: updatedComment.userId,
            postId: updatedComment.postId,
            content: updatedComment.content,
            parentCommentId: updatedComment.parentCommentId ?? undefined,
        };
    }

    async deleteComment(dto: CommentIdDTO): Promise<CommentDTO> {
        const commentUniqueInput: Prisma.CommentWhereUniqueInput = {
            commentId: dto.commentId,
        };

        const deletedComment =
            await this.commentRepository.softDeleteComment(commentUniqueInput);

        return {
            commentId: deletedComment.commentId,
            userId: deletedComment.userId,
            postId: deletedComment.postId,
            content: deletedComment.content,
            parentCommentId: deletedComment.parentCommentId ?? undefined,
        };
    }
}
