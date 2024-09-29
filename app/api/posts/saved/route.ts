import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prismadb";
import { AuthOptions, getServerSession } from "next-auth"
import { ISession } from '@/types/session';

export async function GET(req: NextRequest, res: NextResponse) {

    const session: ISession = await getServerSession(authOptions as AuthOptions)

    if (!session) {
        return NextResponse.json({});
    }

    const posts = await prisma.post.findMany({
        where: {
            id: {
                in: session?.savedPosts
            }
        },
        include: {
            author: {
                select: {
                    username: true,
                    name: true,
                    image: true,
                    email: true,
                }
            }
        }
    })

    return NextResponse.json({
        posts
    })

}


export async function POST(req: NextRequest, res: NextResponse) {
    const session: ISession = await getServerSession(authOptions as AuthOptions)

    const { id: postId } = await req.json()

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const activeUser = await prisma.user.findFirst({
        where: {
            email: session.email
        }
    })

    if (!activeUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }


    if (activeUser.savedPosts.includes(postId)) {
        const index = activeUser.savedPosts.indexOf(postId)

        activeUser.savedPosts.splice(index, 1)

        await prisma.user.update({
            where: {
                id: activeUser.id
            },
            data: {
                savedPosts: {
                    set: activeUser.savedPosts
                }
            },
        })

        return NextResponse.json({ message: "Post removed from saved" }, { status: 200 });

    }

    activeUser.savedPosts.push(postId)

    await prisma.user.update({
        where: {
            id: activeUser.id
        },
        data: {
            savedPosts: {
                set: activeUser.savedPosts
            }
        },
    })

    return NextResponse.json({ message: "Post saved" }, { status: 200 });

}