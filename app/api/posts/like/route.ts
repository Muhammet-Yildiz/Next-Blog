
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prismadb";
import { AuthOptions, getServerSession } from "next-auth"
import { ISession } from '@/types/session';

export async function POST(req: NextRequest, res: NextResponse) {

    const session: ISession = await getServerSession(authOptions as AuthOptions)
    const { id: postId, likesCount } = await req.json()

    await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            likesCount: likesCount
        }
    })

    if (!session) {
        return NextResponse.json({});
    }


    if (session.likedPosts.includes(postId)) {
        return NextResponse.json({ message: "Post already liked" }, { status: 200 });
    }

    await prisma.user.update({
        where: {
            id: session.id
        },
        data: {
            likedPosts: {
                set: [...session.likedPosts, postId]
            }
        }
    })

    sendNotifications(session, postId)
    return NextResponse.json({ message: "Post liked" }, { status: 200 });

}


async function sendNotifications(session: ISession, postId: string) {
    const followers = await prisma.user.findMany({
        where: {
            following: {
                some: {
                    id: session?.id
                }
            }
        }
    })

    const notificationPromises = followers.map((follower) => {
        return prisma.notification.create({
            data: {
                type: 'applause',
                userId: follower.id,
                actionById: session?.id,
                content: `${session?.username || session?.name} applauded ${postId}`,
                postId: postId,
            },
        });
    });

    await Promise.all(notificationPromises);
}