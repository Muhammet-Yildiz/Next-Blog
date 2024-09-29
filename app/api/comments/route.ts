

import { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/prismadb";
import { authOptions } from "@/lib/authOptions";
import { AuthOptions, getServerSession } from "next-auth"
import { ISession } from '@/types/session';


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
        return NextResponse.json({ message: "PostId is required" }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
        where: {
            postId: postId
        },
        select: {
            content: true,
            createdAt: true,
            author: {
                select: {
                    username: true,
                    image: true
                }
            },

        },


    })

    return NextResponse.json(comments, { status: 200 });

}


export async function POST(request: NextRequest) {
    const session: ISession = await getServerSession(authOptions  as AuthOptions)
    const { postId, content } = await request.json()

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    }


    const newComment = await prisma.comment.create({
        data: {
            postId: postId,
            content: content,
            authorId: session.id
        }
    })

    return NextResponse.json(newComment, { status: 200 });

}



export async function DELETE(req: NextRequest, res: NextResponse) {

    const session: ISession = await getServerSession(authOptions as AuthOptions)
    const { id: commentId } = await req.json()

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

   await prisma.comment.delete({
        where: {
            id: commentId
        }
    })


    return NextResponse.json({message: "Comment deleted"}, { status: 200 });
}