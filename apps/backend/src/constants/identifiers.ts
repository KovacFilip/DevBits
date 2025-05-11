export const REPOSITORY_IDENTIFIER = {
    USER_REPOSITORY: Symbol.for('IUserRepository'),
    POST_REPOSITORY: Symbol.for('IPostRepository'),
    LIKE_REPOSITORY: Symbol.for('ILikeRepository'),
    COMMENT_REPOSITORY: Symbol.for('ICommentRepository'),
};

export const SERVICE_IDENTIFIER = {
    USER_SERVICE: Symbol.for('IUserService'),
    POST_SERVICE: Symbol.for('IPostService'),
    LIKE_SERVICE: Symbol.for('ILikeService'),
    COMMENT_SERVICE: Symbol.for('ICommentService'),
};

export const DATABASE_IDENTIFIER = {
    PRISMA: Symbol.for('PrismaClient'),
};
