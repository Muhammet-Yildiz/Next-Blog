import { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/prismadb";
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const cursor = searchParams.get('cursor');
    const take = searchParams.get('take');
    const tag = searchParams.get('tag');
    const sortType = searchParams.get('sst');
    const takeNumber = parseInt(take as string) || 6;

    const sortOptions: { [key: string]: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[] } = {
        'RECOMMENDED': [
            { likesCount: 'desc' }, 
            { viewCount: 'desc' },  
        ],
        'MOST_RECENT': { createdAt: 'desc' },
        'LEAST_RECENT': { createdAt: 'asc' },
        'MOST_LIKED': { likesCount: 'desc' },
        'LEAST_LIKED': { likesCount: 'asc' },
        'MOST_VIEWED': { viewCount: 'desc' },
        'LEAST_VIEWED': { viewCount: 'asc' },
        'MOST_COMMENTED': { comments: { _count: 'desc' } },
    };


    const orderBy = sortOptions[sortType as keyof typeof sortOptions] || { createdAt: 'desc' };

    if (tag) {
        const currentTag = await prisma.tag.findFirst({
            where: {
                name: tag as string,
            },
        });

        if (!currentTag) {
            return NextResponse.json({
                posts: [],
                nextCursor: null,
            });
        }


        const posts = await prisma.post.findMany({
            where: {
                relatedTags: {
                    has: currentTag.id,
                },
            },
            orderBy,
            take: takeNumber,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor as string } : undefined,
            include: {
                author: {
                    select: {
                        username: true,
                        email: true,
                        image: true,
                    },
                },
                comments: {
                    select: {
                        content: true,
                        createdAt: true,
                        author: { select: { username: true, image: true } },
                    },
                },
            },
        });
        if(sortType === 'RECOMMENDED') {
            posts.sort((a, b) => (b.viewCount + b.likesCount) - (a.viewCount + a.likesCount));
         }   
        return NextResponse.json({ posts, nextCursor: posts[posts.length - 1]?.id || null });

    }


    const posts = await prisma.post.findMany({
        orderBy,
        take: takeNumber,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor as string } : undefined,
        include: {
            author: {
                select: {
                    username: true,
                    email: true,
                    image: true,
                },
            },
            comments: {
                select: {
                    content: true,
                    createdAt: true,
                    author: { select: { username: true, image: true } },
                },
            },
        },
    });

    if(sortType === 'RECOMMENDED') {
        posts.sort((a, b) => (b.viewCount + b.likesCount) - (a.viewCount + a.likesCount));
     }   
    return NextResponse.json({ posts, nextCursor: posts.length > 0 ? posts[posts.length - 1]?.id : null });

}