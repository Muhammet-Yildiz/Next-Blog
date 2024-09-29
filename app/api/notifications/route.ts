import { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/prismadb";
import { authOptions } from "@/lib/authOptions";
import { AuthOptions, getServerSession } from "next-auth"

import { ISession } from '@/types/session';

export async function GET(request: NextRequest) {

    const session: ISession = await getServerSession(authOptions as AuthOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized', status: 401 })
    }

    const allNotifications = await prisma.notification.findMany({
        where: {
            userId: session?.id,
            actionById: {
                in: session?.followingIDs
            }
        },
        include: {
            post: {
                select: {
                    id: true,
                    image: true,
                    title: true
                }
            },
            actionBy: {
                select: {
                    name: true,
                    username: true,
                    image: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const unReadNotifications = allNotifications.filter((notification) => !notification.isRead)


    return NextResponse.json({ 
        allNotifications ,
        unReadNotifications
     }, { status: 200 })

}

export async function POST(request: NextRequest ,response: NextResponse) { 

    await prisma.notification.updateMany({
        data: {
            isRead: true,
        }
    });

    return NextResponse.json({ message: 'All notifications marked as read' }, { status: 200 });

}


export async function DELETE(request: NextRequest) {


    const session: ISession = await getServerSession(authOptions as AuthOptions)
    const { id: notificationId } = await request.json()

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }


    await prisma.notification.delete({
        where: {
            id: notificationId
        }
    })

    return NextResponse.json({ message: "Notification deleted" }, { status: 200 })

}