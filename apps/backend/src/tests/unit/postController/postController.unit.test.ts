import { PostController } from 'apps/backend/src/controllers/PostController';
import { pinoLogger } from 'apps/backend/src/logger/pino';
import { IPostController } from 'apps/backend/src/models/interfaces/controllers/IPostController';
import { postService } from 'apps/backend/src/tests/unit/__mocks__/postService';
import {
    getMockFastifyRepsponse,
    getMockFastifyRequestAuthenticated,
} from 'apps/backend/src/tests/unit/utils/post/controllerUtils';
import {
    getMockCreatePostDTO,
    getMockPostIdDTO,
    getMockPostWithContentDTO,
    getMockUpdatePostDTO,
    getMockUserIdDTO,
} from 'apps/backend/src/tests/unit/utils/post/dtoUtils';
import { PostSimpleDTO, PostWithContentDTO } from 'packages/shared';
import { beforeEach, describe, expect, it } from 'vitest';

describe('PostController', () => {
    let postController: IPostController;

    beforeEach(() => {
        postController = new PostController(postService, pinoLogger);
    });

    describe('createPost', () => {
        it('returns a new post', async () => {
            const req = getMockFastifyRequestAuthenticated({
                Body: getMockCreatePostDTO(),
            });

            const response = getMockFastifyRepsponse<{
                Reply: PostWithContentDTO;
            }>();
            const newPost = getMockPostWithContentDTO();

            response.code.mockReturnValue(response);
            postService.createPost.mockResolvedValue(newPost);

            await postController.createPost(req, response);

            expect(response.code).toHaveBeenCalledWith(200);
            expect(response.send).toHaveBeenCalledWith(newPost);
        });
    });

    describe('getPost', () => {
        it('returns an existing post', async () => {
            const req = getMockFastifyRequestAuthenticated({
                Params: getMockPostIdDTO(),
            });

            const response = getMockFastifyRepsponse<{
                Reply: PostWithContentDTO;
            }>();
            const resultPost = getMockPostWithContentDTO();

            response.code.mockReturnValue(response);
            postService.getPostById.mockResolvedValue(resultPost);

            await postController.getPost(req, response);

            expect(response.code).toHaveBeenCalledWith(200);
            expect(response.send).toHaveBeenCalledWith(resultPost);
        });
    });

    describe('getPostByUserId', () => {
        it('returns a list of posts by user', async () => {
            const req = getMockFastifyRequestAuthenticated({
                Params: getMockUserIdDTO(),
            });

            const response = getMockFastifyRepsponse<{
                Reply: PostSimpleDTO[];
            }>();
            const resultPosts = [getMockPostWithContentDTO()];

            response.code.mockReturnValue(response);
            postService.getPostsByUser.mockResolvedValue(resultPosts);

            await postController.getPostByUserId(req, response);

            expect(response.code).toHaveBeenCalledWith(200);
            expect(response.send).toHaveBeenCalledWith(resultPosts);
        });
    });

    describe('updatePost', () => {
        it('returns an updated post', async () => {
            const req = getMockFastifyRequestAuthenticated({
                Params: getMockPostIdDTO(),
                Body: getMockUpdatePostDTO(),
            });

            const response = getMockFastifyRepsponse<{
                Reply: PostWithContentDTO;
            }>();

            const resultPost = getMockPostWithContentDTO({
                content: 'This is an updated content of the post',
            });

            response.code.mockReturnValue(response);
            postService.updatePost.mockResolvedValue(resultPost);

            await postController.updatePost(req, response);

            expect(response.code).toHaveBeenCalledWith(200);
            expect(response.send).toHaveBeenCalledWith(resultPost);
        });
    });

    describe('deletePost', () => {
        it('returns a deleted post', async () => {
            const req = getMockFastifyRequestAuthenticated({
                Params: getMockPostIdDTO(),
            });

            const response = getMockFastifyRepsponse<{
                Reply: PostSimpleDTO;
            }>();

            const resultPost = getMockPostWithContentDTO();

            response.code.mockReturnValue(response);
            postService.deletePost.mockResolvedValue(resultPost);

            await postController.deletePost(req, response);

            expect(response.code).toHaveBeenCalledWith(200);
            expect(response.send).toHaveBeenCalledWith(resultPost);
        });
    });
});
