import { IPostService } from 'apps/backend/src/models/interfaces/services/IPostService';
import { mockDeep } from 'vitest-mock-extended';

export const postService = mockDeep<IPostService>();
