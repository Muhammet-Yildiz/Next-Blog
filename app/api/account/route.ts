import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prismadb";
import { AuthOptions, getServerSession } from 'next-auth';
import { ISession } from '@/types/session';
import { authOptions } from '@/lib/authOptions';
import { deleteFileFromS3, uploadFileToS3 } from '@/lib/aws';

export async function POST(request: NextRequest, response: NextResponse) {
    const session: ISession = await getServerSession(authOptions as AuthOptions)

    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    try {

        const formData = await request.formData()
        const username = formData.get('username')
        const email = formData.get('email')
        const info = formData.get('info')
        const image = formData.get('image') as any


        if (image) {
            const buffer = Buffer.from(await image.arrayBuffer())

            const fileName = await uploadFileToS3(buffer, image.name, 'users')

            await prisma.user.update({
                where: {
                    email: session?.email
                },
                data: {
                    username: username as string,
                    email: email as string,
                    info: info as string,
                    image: fileName
                }
            })
        }
        
        await prisma.user.update({
            where: {
                email: session?.email
            },
            data: {
                username: username as string,
                email: email as string,
                info: info as string
            }
        })

        return NextResponse.json({ message: 'Account updated successfully' }, { status: 200 })

    } catch (error) {

        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
    }

};



export async function DELETE(request: NextRequest, response: NextResponse) {
    const session: ISession = await getServerSession(authOptions as AuthOptions);

    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const userId = session.id;

    const userPosts = await prisma.post.findMany({
        where: {
            authorId: userId,
        },
    });

    const postIds = userPosts.map((post) => post.id);

    const usersWithSavedPosts = await prisma.user.findMany({
        where: {
            savedPosts: { hasSome: postIds },
        },
    });

    const usersWithLikedPosts = await prisma.user.findMany({
        where: {
            likedPosts: { hasSome: postIds },
        },
    });

    for (const user of usersWithSavedPosts) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                savedPosts: {
                    set: user.savedPosts.filter((postId) => !postIds.includes(postId)),
                },
            },
        });
    }

    for (const user of usersWithLikedPosts) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                likedPosts: {
                    set: user.likedPosts.filter((postId) => !postIds.includes(postId)),
                },
            },
        });
    }

    for (const post of userPosts) {
        for (const block of JSON.parse(post.content as string).blocks) {
            if (block.type === 'image') {
                await deleteFileFromS3(block.data.file.url.split('/').pop(), 'posts');
            }
        }

        await prisma.comment.deleteMany({
            where: {
                postId: post.id,
            },
        });

        await prisma.post.delete({
            where: {
                id: post.id,
            },
        });
    }

    const usersWithFollower = await prisma.user.findMany({
        where: {
            followersIDs: { has: userId },
        },
    });

    for (const user of usersWithFollower) {
        const updatedFollowers = user.followersIDs.filter(id => id !== userId);
        await prisma.user.update({
            where: { id: user.id },
            data: { followersIDs: updatedFollowers },
        });
    }

    const usersWithFollowing = await prisma.user.findMany({
        where: {
            followingIDs: { has: userId },
        },
    });

    for (const user of usersWithFollowing) {
        const updatedFollowing = user.followingIDs.filter(id => id !== userId);
        await prisma.user.update({
            where: { id: user.id },
            data: { followingIDs: updatedFollowing },
        });
    }



    await prisma.account.deleteMany({
        where: {
            userId: userId,
        },
    });


    await prisma.user.delete({
        where: {
            id: userId,
        },
    });



    return NextResponse.json({ message: 'User deleted successfully' });
}