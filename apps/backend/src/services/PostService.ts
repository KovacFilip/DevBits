import {
    LOGGER,
    REPOSITORY_IDENTIFIER,
} from 'apps/backend/src/constants/identifiers';
import { NotFoundError } from 'apps/backend/src/errors/NotFoundError';
import { logServiceErrorTrace } from 'apps/backend/src/helpers/loggingHelpers';
import {
    mapPostModelToPostSimpleDTO,
    mapPostModelToPostWithContentDTO,
} from 'apps/backend/src/mappers/modelsToDtos/Post';
import { IPostRepository } from 'apps/backend/src/models/interfaces/repositories/IPostRepository';
import { IPostService } from 'apps/backend/src/models/interfaces/services/IPostService';
import { CreatePostModel } from 'apps/backend/src/models/models/Post';
import { inject, injectable } from 'inversify';
import {
    CreatePostDTO,
    PostIdDTO,
    PostSimpleDTO,
    PostWithContentDTO,
    UpdatePostDTO,
    UserIdDTO,
} from 'packages/shared';
import { Logger } from 'pino';

@injectable()
export class PostService implements IPostService {
    constructor(
        @inject(REPOSITORY_IDENTIFIER.POST_REPOSITORY)
        private readonly postRepository: IPostRepository,
        @inject(LOGGER.LOGGER) private readonly logger: Logger
    ) {}

    async createPost(
        user: UserIdDTO,
        createPost: CreatePostDTO
    ): Promise<PostWithContentDTO> {
        try {
            const postToCreate: CreatePostModel = {
                title: createPost.title,
                content: createPost.content,
                userId: user.userId,
            };

            const createdPost =
                await this.postRepository.createPost(postToCreate);

            return mapPostModelToPostWithContentDTO(createdPost);
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { user, createPost },
                service: 'PostService',
                method: 'createPost',
            });

            throw err;
        }
    }

    async getPostById(dto: PostIdDTO): Promise<PostWithContentDTO> {
        try {
            const post = await this.postRepository.readPost(dto.postId);

            if (!post) {
                throw new NotFoundError(
                    `Unable to find the post with id: ${dto.postId}`
                );
            }

            return mapPostModelToPostWithContentDTO(post);
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'PostService',
                method: 'getPostById',
            });

            throw err;
        }
    }

    async getPostsByUser(dto: UserIdDTO): Promise<PostSimpleDTO[]> {
        try {
            const posts = await this.postRepository.readUsersPosts(dto.userId);

            return posts.map((post) => {
                return mapPostModelToPostSimpleDTO(post);
            });
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'PostService',
                method: 'getPostsByUser',
            });

            throw err;
        }
    }

    async updatePost(
        postIdDto: PostIdDTO,
        updatePostDto: UpdatePostDTO
    ): Promise<PostWithContentDTO> {
        try {
            const updatedPost = await this.postRepository.updatePost(
                postIdDto.postId,
                {
                    content: updatePostDto.content,
                    title: updatePostDto.title,
                }
            );

            return mapPostModelToPostWithContentDTO(updatedPost);
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { postIdDto, updatePostDto },
                service: 'PostService',
                method: 'updatePost',
            });

            throw err;
        }
    }

    async deletePost(dto: PostIdDTO): Promise<PostSimpleDTO> {
        try {
            const deletedPost = await this.postRepository.softDeletePost(
                dto.postId
            );

            return mapPostModelToPostSimpleDTO(deletedPost);
        } catch (err) {
            logServiceErrorTrace({
                logger: this.logger,
                functionInput: { dto },
                service: 'PostService',
                method: 'deletePost',
            });

            throw err;
        }
    }
}
