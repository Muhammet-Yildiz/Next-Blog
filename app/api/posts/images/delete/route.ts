import { NextRequest, NextResponse } from 'next/server';
import { AuthOptions, getServerSession } from 'next-auth';
import { ISession } from '@/types/session';
import { authOptions } from '@/lib/authOptions';
import { deleteFileFromS3 } from '@/lib/aws';

export async function POST(request: NextRequest, response: NextResponse) {
    const session: ISession = await getServerSession(authOptions as AuthOptions)

    if (!session) return NextResponse.json({ message: 'unauthorized' })

    const { imagePath } = await request.json()

    console.log("Deleting image path : " , imagePath)

    try {

        if (imagePath) {
            const fileName = imagePath?.split('/').pop()

            await deleteFileFromS3(fileName, 'posts')

            return NextResponse.json({
                message: `Deleted ${fileName}`
            })
        }

        return NextResponse.json({})


    } catch (error) {

        return NextResponse.json({
            message: 'error'
        });
    }

};