import { PostRepository } from 'apps/backend/src/repositories/PostRepository';
import { mock } from 'vitest-mock-extended';

export const postRepository = mock<PostRepository>();
