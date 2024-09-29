import { signUpSchema } from "@/lib/zod/types";
import { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/prismadb";
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
    const body: unknown = await request.json();
    const result = signUpSchema.safeParse(body);

    if (result.success) {
        const { username, email, password } = result.data;

        if (!email || !password || !username) {

            return new NextResponse('Missing fields', { status: 400 });
        }
        const existuser = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (existuser) {
            return new NextResponse('User already exists. Please try again with a different email address.', { status: 422 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                hashedPassword,
                info: ''
            }
        });
        // console.log("current user", user );
        return NextResponse.json(user, { status: 201 });

    }


    return new NextResponse(' Invalid data provided', { status: 422 });

}