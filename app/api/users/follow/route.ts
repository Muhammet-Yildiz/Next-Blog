import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prismadb";
import { AuthOptions, getServerSession } from "next-auth"
import { ISession } from '@/types/session';
import { User } from '@prisma/client';

export async function POST(req: NextRequest, res: NextResponse) {

    const session: ISession = await getServerSession(authOptions as AuthOptions)

    if (!session) {
        return NextResponse.redirect('/login')
    }

    const { userId } = await req.json()

    const activeUser = await prisma.user.findUnique({
        where: {
            email: session.email
        }
    })
    const targetUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!targetUser) return NextResponse.json({ "Kullanıcı bulunamadı ": userId })


    if (activeUser?.followingIDs.includes(targetUser?.id)) {

        await prisma.user.update({
            where: {
                email: session.email
            },
            data: {
                following: {
                    disconnect: {
                        id: targetUser?.id
                    }
                }
            }
        })
        await prisma.user.update({
            where: {
                id: targetUser?.id
            },
            data: {
                followers: {
                    disconnect: {
                        id: activeUser?.id
                    }
                }
            }
        })
        sendFollowNotifications(session, targetUser, 'unfollow')

        return NextResponse.json({ status: 200 });


    }
    else {
        await prisma.user.update({
            where: {
                email: session.email
            },
            data: {
                following: {
                    connect: {
                        id: targetUser?.id
                    }
                }

            }
        })
        await prisma.user.update({
            where: {
                id: targetUser?.id
            },
            data: {
                followers: {
                    connect: {
                        id: activeUser?.id
                    }
                }
            }
        })


        sendFollowNotifications(session, targetUser, 'follow')

        return NextResponse.json({ status: 200 });
    }

}


async function sendFollowNotifications(session: ISession, targetUser: User, status: 'follow' | 'unfollow') {
    const followers = await prisma.user.findMany({
        where: {
            AND: [
                {
                    following: {
                        some: {
                            id: session?.id
                        }
                    }
                },
                {
                    id: {
                        not: targetUser.id
                    }
                }
            ]
        }
    })
    if (status == 'follow') {
        await prisma.notification.create({
            data: {
                content: `${session?.username || session?.name} || is started following || you`,
                type: "follow",
                userId: targetUser?.id,
                actionById: session?.id
            }
        })


        const notificationPromises = followers.map((follower: User) => {
            return prisma.notification.create({
                data: {
                    type: 'follow',
                    userId: follower.id,
                    actionById: session?.id,
                    content: `${session?.username || session?.name} || is started following || ${targetUser?.username || targetUser?.name}`,
                },
            });
        });


        await Promise.all(notificationPromises);
    }

    else if (status == 'unfollow') {

        await prisma.notification.deleteMany({
            where: {
                type: "follow",
                userId: targetUser?.id,
                actionById: session?.id,
            }
        });
        const deleteNotificationPromises = followers.map((follower: User) => {
            return prisma.notification.deleteMany({
                where: {
                    type: "follow",
                    userId: follower.id,
                    actionById: session?.id,
                },
            });

        });

        await Promise.all(deleteNotificationPromises);

    }

}