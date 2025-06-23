import { PrismaClient } from 'apps/backend/prisma/generated/client';
import {
    benDover,
    mikeOxLong,
    mikesPost,
} from 'apps/backend/prisma/seed/seedData';

const prisma = new PrismaClient();

async function main() {
    // Cleanup previous data
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.oAuthAccount.deleteMany();
    await prisma.user.deleteMany();

    // Seed Users
    const mike = await prisma.user.create({
        data: mikeOxLong,
    });

    const ben = await prisma.user.create({
        data: benDover,
    });

    // Seed Posts
    const postByMike = await prisma.post.create({
        data: mikesPost,
    });

    const post2 = await prisma.post.create({
        data: {
            postId: 'post-2222',
            title: 'Hello World',
            content: 'This is a post by Bob.',
            userId: ben.userId,
        },
    });

    // Seed Comments
    const comment1 = await prisma.comment.create({
        data: {
            commentId: 'comment-1111',
            content: 'Nice post!',
            userId: ben.userId,
            postId: postByMike.postId,
        },
    });

    const comment2 = await prisma.comment.create({
        data: {
            commentId: 'comment-2222',
            content: 'Thanks!',
            userId: mike.userId,
            postId: postByMike.postId,
            parentCommentId: comment1.commentId,
        },
    });

    // Seed Likes on Post
    await prisma.like.createMany({
        data: [
            {
                likeId: 'like-1111',
                userId: mike.userId,
                postId: post2.postId,
            },
            {
                likeId: 'like-2222',
                userId: ben.userId,
                postId: postByMike.postId,
            },
        ],
    });

    // Seed Likes on Comments
    await prisma.like.createMany({
        data: [
            {
                likeId: 'like-3333',
                userId: mike.userId,
                commentId: comment1.commentId,
            },
            {
                likeId: 'like-4444',
                userId: ben.userId,
                commentId: comment2.commentId,
            },
        ],
    });

    console.log('Seeding complete!');
}

main()
    .then(async () => {
        const post = await prisma.post.findUnique({
            where: {
                postId: '76a2ebfe-6513-466d-b73d-68abbaf9cce2 ',
            },
        });

        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
