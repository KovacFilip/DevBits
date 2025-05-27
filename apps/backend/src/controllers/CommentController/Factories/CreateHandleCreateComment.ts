import { handleCreateComment } from 'apps/backend/src/controllers/CommentController/Handlers/HandleCreateComment';
import { ICommentService } from 'apps/backend/src/models/interfaces/services/ICommentService';

export const createHandleCreateComment = (commentService: ICommentService) => {
    return handleCreateComment(commentService);
};
