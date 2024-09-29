import { authOptions } from "@/lib/authOptions";
import { ISession } from "@/types/session";
import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request: NextRequest, response: NextResponse) {
    const session: ISession = await getServerSession(authOptions as AuthOptions);
    const postId = request.nextUrl.pathname?.split("/")[3];
    if (!postId) {
        return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { author: true },
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const author = await prisma.user.findUnique({ where: { id: post.authorId as string } });
        const followingStatus = post.author && session && post.author.followersIDs.includes(session?.id)

  
        const otherPostsByAuthor = await prisma.post.findMany({
            where: {
                authorId: post.authorId,
                id: { not: postId }, 
            },
            take: 4,
            include: {
                author: {
                    select: { username: true, image: true, name: true },
                },
                comments: {
                    select: {
                        id: true,
                    },
                },

            },
        });
        const relatedPostsByTopics = await prisma.post.findMany({
            where: {
                relatedTags: {
                    hasSome: post.relatedTags,
                },
                id: { not: postId },

            },
            take: 6,
            include: {
                author: {
                    select: { username: true, image: true, name: true },
                },
                comments: {
                    select: {
                        id: true,
                    },
                },
            },
        });


        return NextResponse.json({
            author: {
                ...author,
                followingStatus
            },
            authorPosts: otherPostsByAuthor,
            relatedPosts: relatedPostsByTopics,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}