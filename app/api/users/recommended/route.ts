
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prismadb";
import { AuthOptions, getServerSession } from "next-auth"
import { ISession } from '@/types/session';

export async function GET(req: NextRequest, res: NextResponse) {
    
    const session: ISession = await getServerSession(authOptions  as AuthOptions)

    if (!session) {
        const users = await prisma.user.findMany()
        const recommendedUsers = users.sort(() => Math.random() - 0.5).slice(0, 3).map((user) => {
            return {
                id: user.id,
                username: user.username || user.name,
                email: user.email,
                image: user.image,
                info: user.info
            }
        })
        return NextResponse.json( {
            users : recommendedUsers
        })
    }

    const activeUser = await prisma.user.findFirst({
        where: {
            email: session.email
        }
    })

    const users = await prisma.user.findMany({
        where: {
            NOT: {
                id: activeUser?.id
            }
        }
    })

    const filteredUsers = users.filter((user) => !activeUser?.followingIDs.includes(user.id))


    const recommendedUsers = filteredUsers.sort(() => Math.random() - 0.5).slice(0, 3).map((user) => {
        return {
            id: user.id,
            username: user.username || user.name,
            email: user.email,
            image: user.image,
            info: user.info
        }
    })

    return NextResponse.json({
        users : recommendedUsers
    })

}