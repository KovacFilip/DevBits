import { handleDeleteComment } from 'apps/backend/src/controllers/CommentController/Handlers/HandleDeleteComment';
import { ICommentService } from 'apps/backend/src/models/interfaces/services/ICommentService';

export const createHandleDeleteComment = (commentService: ICommentService) => {
    return handleDeleteComment(commentService);
};
