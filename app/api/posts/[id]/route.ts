
import { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/prismadb";
import { ISession } from '@/types/session';
import { authOptions } from '@/lib/authOptions';
import { AuthOptions, getServerSession } from 'next-auth';

export async function GET(request: NextRequest, response: NextResponse) {
    const session: ISession = await getServerSession(authOptions  as AuthOptions)
    const id = request.nextUrl.pathname?.split("/")[3]

    const post = await prisma.post.update({
        where: {
            id: id
        },
        data: {
            viewCount: {
                increment: 1
            }
        },
        include: {
            author: {
                select: {
                    username: true,
                    name: true,
                    email: true,
                    image: true,
                    followersIDs: true
                }
            },
            comments: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            image: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });


    if (!post) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }


    const relatedTagsPromises = post.relatedTags.map(async (tag) => {
        const tagData = await prisma.tag.findUnique({
            where: {
                id: tag
            }
        });
        return tagData;
    });

    const relatedTags = (await Promise.all(relatedTagsPromises)).filter((tag) => tag !== null);


    return NextResponse.json({
        post : {
            ...post,
            relatedTags : relatedTags,
            followingStatus : post.author && session &&   post.author.followersIDs.includes(session?.id) ,
            likedStatus : session && session.likedPosts.includes(post.id)
        }
    });

}