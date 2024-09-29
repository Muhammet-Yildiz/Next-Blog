import { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/prismadb";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ message: "Query is required" }, { status: 400 });
    }

    const posts = await prisma.post.findMany({
        where: {
            title: {
                contains: query,
                mode: 'insensitive'
            },
        },
        select: {
            id: true,
            title: true,
            image: true,
        },
        take: 10
    })


    const users = await prisma.user.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: query,
                        mode: 'insensitive'
                    },
                },
                {
                    username: {
                        contains: query,
                        mode: 'insensitive'
                    },
                },
            ]
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            image: true,
        },
        take: 4
    })


    const topics = await prisma.tag.findMany({
        where: {
            name: {
                contains: query,
                mode: 'insensitive'
            },
        },
        select: {
            id: true,
            name: true,
        },
        take: 6
    })

    
    return NextResponse.json({
        posts,
        users,
        topics
    })

}