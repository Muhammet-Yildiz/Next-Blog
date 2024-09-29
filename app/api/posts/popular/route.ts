import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { ISession } from "@/types/session";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest, res: NextResponse) {
  
    const session: ISession = await getServerSession(authOptions  as AuthOptions)

    const posts = await prisma.post.findMany({
        orderBy: {
            likesCount: "desc"
        },
        include: {
            author: {
                select: {
                    username: true,
                    image: true,
                    email: true,
                    name: true
                }
            }
        },
        take: 6
    })

    const randomPosts = posts.sort(() => Math.random() - 0.5).slice(0, 3)

    return NextResponse.json({
        posts: randomPosts
    })

}