import { Prisma } from 'apps/backend/prisma/generated/client';
import { REPOSITORY_IDENTIFIER } from 'apps/backend/src/constants/identifiers';
import { NotFoundError } from 'apps/backend/src/errors/NotFoundError';
import { ICommentRepository } from 'apps/backend/src/models/interfaces/repositories/ICommentRepository';
import { ICommentService } from 'apps/backend/src/models/interfaces/services/ICommentService';
import { inject, injectable } from 'inversify';
import {
    CommentDTO,
    CommentIdDTO,
    CreateCommentDTO,
    PostIdDTO,
    SimpleCommentDTO,
    UpdateCommentDTO,
    UserIdDTO,
} from 'packages/shared';

@injectable()
export class CommentService implements ICommentService {
    constructor(
        @inject(REPOSITORY_IDENTIFIER.COMMENT_REPOSITORY)
        private readonly commentRepository: ICommentRepository
    ) {}

    async createComment(
        userIdDTO: UserIdDTO,
        createCommentDto: CreateCommentDTO
    ): Promise<CommentDTO> {
        const commentToCreate: Prisma.CommentCreateInput = {
            user: { connect: { userId: userIdDTO.userId } },
            post: { connect: { postId: createCommentDto.postId } },
            content: createCommentDto.content,
            ...(createCommentDto.parentCommentId && {
                parentComment: {
                    connect: { commentId: createCommentDto.parentCommentId },
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

    async getCommentsForPost(dto: PostIdDTO): Promise<SimpleCommentDTO[]> {
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
                content: comment.content,
            };
        });
    }

    async getCommentsByUser(dto: UserIdDTO): Promise<SimpleCommentDTO[]> {
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
                content: comment.content,
            };
        });
    }

    async updateComment(
        commentIdDto: CommentIdDTO,
        newCommentData: UpdateCommentDTO
    ): Promise<CommentDTO> {
        const where: Prisma.CommentWhereUniqueInput = {
            commentId: commentIdDto.commentId,
        };

        const data: Prisma.CommentUpdateInput = {
            content: newCommentData.content,
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

    async deleteComment(dto: CommentIdDTO): Promise<SimpleCommentDTO> {
        const commentUniqueInput: Prisma.CommentWhereUniqueInput = {
            commentId: dto.commentId,
        };

        const deletedComment =
            await this.commentRepository.softDeleteComment(commentUniqueInput);

        return {
            commentId: deletedComment.commentId,
            content: deletedComment.content,
        };
    }
}
