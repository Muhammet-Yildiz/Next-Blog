

import { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/prismadb";
import { AuthOptions, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { ISession } from '@/types/session';

export async function GET(request: NextRequest) {

    const session: ISession = await getServerSession(authOptions as AuthOptions)

    const { searchParams } = new URL(request.url);

    const filterType = searchParams.get('filterType');

    if(filterType === 'all') {
        const tags = await prisma.tag.findMany();
        return NextResponse.json({ topics: tags });
    }

    else if (filterType === 'mostUsed' || session?.likedPosts.length === 0 || !session) {
        
        const posts = await prisma.post.findMany({
            select: {
                relatedTags: true,
            },
        });
        const tagCounts = posts.reduce((acc: Record<string, number>, post: { relatedTags: string[] }) => {
            post.relatedTags.forEach((tag) => {
                acc[tag] = (acc[tag] || 0) + 1;
            });
            return acc;
        }, {});


        const mostUsedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

        const firstTenIds = mostUsedTags.slice(0, 10);

        const tagPromises = firstTenIds.map(id => 
            prisma.tag.findUnique({ where: { id } })
        );
        
        const tags = await Promise.all(tagPromises);


        return NextResponse.json({
            topics:  filterType !== 'mostUsed' ? tags : tags.sort(() => 0.5 - Math.random())
         });
    }
    else if (filterType === 'userPreferred') {
        const likedPosts = session?.likedPosts || [];

        const likedTags = await prisma.post.findMany({
            where: {
                id: { in: likedPosts },
            },
            select: {
                relatedTags: true,
            },
        });

        const tagCounts = likedTags.reduce((acc: Record<string, number>, post: { relatedTags: string[] } ) => {
            post.relatedTags.forEach(tag => {
                acc[tag] = (acc[tag] || 0) + 1;
            });
            return acc;
        }, {});

        const preferredTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
        const firstTenIds = preferredTags.slice(0, 10);
        
        const tagPromises = firstTenIds.map(id => 
            prisma.tag.findUnique({ where: { id } })
        );
        
        const tags = await Promise.all(tagPromises);

        return NextResponse.json({
            topics : tags
        });
    }

}

export async function POST(request: NextRequest) {
    const { name } = await request.json();

    const tag = await prisma.tag.create({
        data: {
            name
        }
    })

    return NextResponse.json(tag);
}