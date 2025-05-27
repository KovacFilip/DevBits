import { handleGetComment } from 'apps/backend/src/controllers/CommentController/Handlers/HandleGetComment';
import { ICommentService } from 'apps/backend/src/models/interfaces/services/ICommentService';

export const createHandleGetComment = (commentService: ICommentService) => {
    return handleGetComment(commentService);
};
