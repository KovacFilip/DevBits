import { PrismaClient } from 'apps/backend/prisma/generated/client';
import { CommentController } from 'apps/backend/src/controllers/CommentController';
import { LikeController } from 'apps/backend/src/controllers/LikeController';
import { PostController } from 'apps/backend/src/controllers/PostController';
import { UserController } from 'apps/backend/src/controllers/UserController';
import { ICommentController } from 'apps/backend/src/models/interfaces/controllers/ICommentController';
import { ILikeController } from 'apps/backend/src/models/interfaces/controllers/ILikeController';
import { IPostController } from 'apps/backend/src/models/interfaces/controllers/IPostController';
import { IUserController } from 'apps/backend/src/models/interfaces/controllers/IUserController';
import { ICommentRepository } from 'apps/backend/src/models/interfaces/repositories/ICommentRepository';
import { ILikeRepository } from 'apps/backend/src/models/interfaces/repositories/ILikeRepository';
import { IPostRepository } from 'apps/backend/src/models/interfaces/repositories/IPostRepository';
import { IUserRepository } from 'apps/backend/src/models/interfaces/repositories/IUserRepository';
import { Container } from 'inversify';
import 'reflect-metadata';
import {
    CONTROLLER_IDENTIFIER,
    DATABASE_IDENTIFIER,
    REPOSITORY_IDENTIFIER,
    SERVICE_IDENTIFIER,
} from '../constants/identifiers';
import { ICommentService } from '../models/interfaces/services/ICommentService';
import { ILikeService } from '../models/interfaces/services/ILikeService';
import { IPostService } from '../models/interfaces/services/IPostService';
import { IUserService } from '../models/interfaces/services/IUserService';
import { CommentRepository } from '../repositories/CommentRepository';
import { LikeRepository } from '../repositories/LikeRepository';
import { PostRepository } from '../repositories/PostRepository';
import { UserRepository } from '../repositories/UserRepository';
import { CommentService } from '../services/CommentService';
import { LikeService } from '../services/LikeService';
import { PostService } from '../services/PostService';
import { UserService } from '../services/UserService';

const container = new Container();

// Prisma
const prisma = new PrismaClient();
container
    .bind<PrismaClient>(DATABASE_IDENTIFIER.PRISMA)
    .toConstantValue(prisma);

// Repositories
container
    .bind<IUserRepository>(REPOSITORY_IDENTIFIER.USER_REPOSITORY)
    .to(UserRepository);

container
    .bind<IPostRepository>(REPOSITORY_IDENTIFIER.POST_REPOSITORY)
    .to(PostRepository);

container
    .bind<ICommentRepository>(REPOSITORY_IDENTIFIER.COMMENT_REPOSITORY)
    .to(CommentRepository);

container
    .bind<ILikeRepository>(REPOSITORY_IDENTIFIER.LIKE_REPOSITORY)
    .to(LikeRepository);

// Services
container.bind<IUserService>(SERVICE_IDENTIFIER.USER_SERVICE).to(UserService);
container.bind<IPostService>(SERVICE_IDENTIFIER.POST_SERVICE).to(PostService);
container
    .bind<ICommentService>(SERVICE_IDENTIFIER.COMMENT_SERVICE)
    .to(CommentService);
container.bind<ILikeService>(SERVICE_IDENTIFIER.LIKE_SERVICE).to(LikeService);

// Controllers
container
    .bind<IUserController>(CONTROLLER_IDENTIFIER.USER_CONTROLLER)
    .to(UserController);

container
    .bind<ICommentController>(CONTROLLER_IDENTIFIER.COMMENT_CONTROLLER)
    .to(CommentController);

container
    .bind<ILikeController>(CONTROLLER_IDENTIFIER.LIKE_CONTROLLER)
    .to(LikeController);

container
    .bind<IPostController>(CONTROLLER_IDENTIFIER.POST_CONTROLLER)
    .to(PostController);

export { container };
