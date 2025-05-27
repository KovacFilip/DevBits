import { handleUpdateComment } from 'apps/backend/src/controllers/CommentController/Handlers/HandleUpdateComment';
import { ICommentService } from 'apps/backend/src/models/interfaces/services/ICommentService';

export const createHandleUpdateComment = (commentService: ICommentService) => {
    return handleUpdateComment(commentService);
};
