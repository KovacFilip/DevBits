import { IPostRepository } from 'apps/backend/src/models/interfaces/repositories/IPostRepository';
import { mock } from 'vitest-mock-extended';

export const postRepository = mock<IPostRepository>();
