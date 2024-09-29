import { NextRequest, NextResponse } from 'next/server';
import { AuthOptions, getServerSession } from 'next-auth';
import { ISession } from '@/types/session';
import { authOptions } from '@/lib/authOptions';
import { uploadFileToS3 } from '@/lib/aws';

export async function POST(request: NextRequest, response: NextResponse) {
    const session: ISession = await getServerSession(authOptions as AuthOptions)

    if (!session) return NextResponse.json({ message: 'unauthorized' })

    try {

        const formData = await request.formData()

        const image = formData.get('image') as any

        if (image) {
            const buffer = Buffer.from(await image.arrayBuffer())

            const fileName = await uploadFileToS3(buffer, image.name, 'posts')

            return NextResponse.json({ fileName })
        }

        return NextResponse.json({})


    } catch (error) {

        return NextResponse.json({
            message: 'error'
        });
    }

};