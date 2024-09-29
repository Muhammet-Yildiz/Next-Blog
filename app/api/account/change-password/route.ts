import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prismadb";
import { AuthOptions, getServerSession } from 'next-auth';
import { ISession } from '@/types/session';
import { authOptions } from '@/lib/authOptions';
import bcrypt from "bcrypt";

export async function POST(request: NextRequest, response: NextResponse) {
    const session: ISession = await getServerSession(authOptions as AuthOptions)

    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

     const { oldPassword, newPassword } = await request.json()


    const user = await prisma.user.findUnique({
        where: {
             id: session.id
        }
    })

    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const passwordMatch = await bcrypt.compare(oldPassword,  user.hashedPassword as string);

    if (!passwordMatch) return NextResponse.json({ message: 'Current password is incorrect' }, { status: 500 })


   const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: {
            id: session.id
        },
        data: {
            hashedPassword: hashedPassword
        }
    })

    return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 })

}