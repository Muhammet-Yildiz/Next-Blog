import { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/prismadb";
import { AuthOptions, getServerSession } from 'next-auth';
import { ISession } from '@/types/session';
import { authOptions } from '@/lib/authOptions';

export async function GET(request: NextRequest, response: NextResponse) {

    const session: ISession = await getServerSession(authOptions as AuthOptions)

    const sub = request.nextUrl.pathname?.split("/")[3]
    const users = await prisma.user.findMany();

    const user = users.find((user: any) => {
        const emailPrefix = user.email.split('@')[0];
        return emailPrefix === sub;
    });


    const targetUser = await prisma.user.findFirst({
        where: {
            id: user?.id
        },
        select: {
            id: true,
            email: true,
            name: true,
            username: true,
            image: true,
            info: true,
            posts: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                    image: true,
                    readingTime: true,
                    author: {
                        select: {
                            username: true,
                            name: true,
                            image: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            },
            followers: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    image: true,
                    email: true
                }
            },
            following: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    image: true,
                    email: true
                }
            },
            followersIDs: true,
            followingIDs: true,
        },


    })

    if (!targetUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
        user: {
            ...targetUser,
            followingStatus: targetUser?.followersIDs?.includes(session?.id as string)
        }
    });

}