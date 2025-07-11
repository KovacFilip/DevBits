import { Comment, Prisma } from 'apps/backend/prisma/generated/client';

export interface ICommentRepository {
    createComment(comment: Prisma.CommentCreateInput): Promise<Comment>;

    readComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Comment | null>;

    readCommentForPost(
        post: Prisma.PostWhereUniqueInput
    ): Promise<Comment[] | null>;

    readCommentForUser(
        user: Prisma.UserWhereUniqueInput
    ): Promise<Comment[] | null>;

    updateComment(
        where: Prisma.CommentWhereUniqueInput,
        data: Prisma.CommentUpdateInput
    ): Promise<Comment>;

    hardDeleteComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Comment>;
    softDeleteComment(
        comment: Prisma.CommentWhereUniqueInput
    ): Promise<Comment>;
}
