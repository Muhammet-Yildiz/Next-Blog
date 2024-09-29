import { forgotPasswordSchema } from "@/lib/zod/types";
import { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/prismadb";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest , response: NextResponse) {
    const body: unknown = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (result.success) {
        const {  email } = result.data;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return NextResponse.json({ success: false,   message: "There is no user associated with this email." } , { status: 404 });
        }

        const resetToken =  await bcrypt.hash(user.email as string, 10);

        const resetTokenExpires = new Date(Date.now() + 1800000);   // half hour access

        await prisma.user.update({
            where: { email: email },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetTokenExpires,
            },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

        console.log(resetUrl)

        const transporter = nodemailer.createTransport({
            service : 'gmail' ,
            auth :{
                user : process.env.SMTP_USER ,
                pass : process.env.SMTP_PASS
            } ,
             tls: {rejectUnauthorized: false}
        });
    
        const mailOptions = {
            from: process.env.SMTP_USER,
            to:  email,
            subject: 'NEXT BLOG - Password Reset Request',
            html: `
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link is valid for 30 minutes.</p>
            `,
        };
    
        await transporter.sendMail(mailOptions);

        return NextResponse.json({
            success: true,
            message: "Password reset link sent to your email"
        } , { status: 200 });

    }

    return NextResponse.json({ success: false, error: result.error } , { status: 400 });

}