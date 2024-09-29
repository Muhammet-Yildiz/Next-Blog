import { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/prismadb";
import bcrypt from 'bcrypt';

export async function GET(request: NextRequest, response: NextResponse) {
    const { searchParams } = new URL(request.url);

    const token = searchParams.get('token');
    const user = await prisma.user.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: {
                gt: new Date(),
            },
        },
    });


    if (!user) {
        return NextResponse.json({ success: false, message: "Invalid or expired token." }, { status: 400 });
    }


    return NextResponse.json({ user }, { status: 200 });
}




export async function POST(request: NextRequest, response: NextResponse) {

    const {token, password } = await request.json()
    
    const user = await prisma.user.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: {
                gt: new Date(), 
            },
        },
    });

    if (!user) {
        return  NextResponse.json({ success: false, message: "Invalid or expired token." }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.update({
        where: { id: user.id },
        data: {
            hashedPassword: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        },
    });


    return NextResponse.json({ success: true }, { status: 200 });
}