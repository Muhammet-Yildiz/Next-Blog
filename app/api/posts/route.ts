import { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/prismadb";
import { authOptions } from "@/lib/authOptions";
import { AuthOptions, getServerSession } from "next-auth"
import { ISession } from '@/types/session';
import { Prisma, User } from '@prisma/client';
import { deleteFileFromS3 } from '@/lib/aws';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const tag = searchParams.get('tag');
    const sortType = searchParams.get('sst');

    const itemsPerPage = 8;
    const skip = (page - 1) * itemsPerPage;

    const sortOptions: { [key: string]: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[] } = {
        'RECOMMENDED': [
            { likesCount: 'desc' },
            { viewCount: 'desc' },
        ],
        'MOST_RECENT': { createdAt: 'desc' },
        'LEAST_RECENT': { createdAt: 'asc' },
        'MOST_LIKED': { likesCount: 'desc' },
        'LEAST_LIKED': { likesCount: 'asc' },
        'MOST_VIEWED': { viewCount: 'desc' },
        'LEAST_VIEWED': { viewCount: 'asc' },
        'MOST_COMMENTED': { comments: { _count: 'desc' } },
    };


    const orderBy = sortOptions[sortType as keyof typeof sortOptions] || { createdAt: 'desc' };

    if (tag) {
        const currentTag = await prisma.tag.findFirst({
            where: {
                name: tag as string,
            },
        });

        if (!currentTag) {
            return NextResponse.json({
                posts: [],
                totalPages: 0,
            });
        }

        const total = await prisma.post.count({
            where: {
                relatedTags: {
                    has: currentTag.id,
                },
            },
        });

        const totalPages = Math.ceil(total / itemsPerPage);

        const posts = await prisma.post.findMany({
            where: {
                relatedTags: {
                    has: currentTag.id,
                },
            },
            include: {
                author: {
                    select: {
                        username: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                comments: {
                    select: {
                        content: true,
                        createdAt: true,
                        author: {
                            select: {
                                username: true,
                                image: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: orderBy,
            skip,
            take: itemsPerPage,
        });

        if (sortType === 'RECOMMENDED') {
            posts.sort((a, b) => (b.viewCount + b.likesCount) - (a.viewCount + a.likesCount));
        }

        return NextResponse.json({
            posts,
            totalPages
        });
    }

    const total = await prisma.post.count();
    const totalPages = Math.ceil(total / itemsPerPage);

    const posts = await prisma.post.findMany({
        include: {
            author: {
                select: {
                    username: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            comments: {
                select: {
                    content: true,
                    createdAt: true,
                    author: {
                        select: {
                            username: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
        orderBy: orderBy,
        skip,
        take: itemsPerPage,
    });


    if (sortType === 'RECOMMENDED') {
        posts.sort((a, b) => (b.viewCount + b.likesCount) - (a.viewCount + a.likesCount));
    }
    return NextResponse.json({
        posts,
        totalPages,
    });
}


export async function POST(request: any) {
    const session: ISession = await getServerSession(authOptions as AuthOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized', status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get('title')
    const content = formData.get('content')
    const imageUrl = formData.get('imageUrl')
    const relatedTags = formData.get('relatedtags')
    const newTags = formData.get('newTags')

    const createdTags = await Promise.all(
        JSON.parse(newTags).map(async (tag: string) => {
            const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
            return await prisma.tag.create({
                data: {
                    name: capitalizedTag,
                },
            });
        })
    );

    const currentTag = await prisma.tag.findFirst({
        where: {
            id: JSON.parse(relatedTags).length > 0 ? JSON.parse(relatedTags)[0] : createdTags[0].id,
        },
    });

    const allTagIds = [
        ...JSON.parse(relatedTags),
        ...createdTags.map((tag) => tag.id),
    ];


    const newPost = await prisma.post.create({
        data: {
            title,
            content,
            image: imageUrl,
            authorId: session?.id,
            relatedTags: allTagIds,
            currentTagName: currentTag?.name,
            readingTime: Math.ceil(content.length / 1300) > 1 ? Math.ceil(content.length / 1300) : 1,
        }
    })


    sendNotifications(session, title, newPost.id)

    return NextResponse.json(newPost, { status: 201 })

}


async function sendNotifications(session: ISession, title: string, postId: string) {
    const followers = await prisma.user.findMany({
        where: {
            following: {
                some: {
                    id: session?.id
                }
            }
        }
    })

    const notificationPromises = followers.map((follower: User) => {
        return prisma.notification.create({
            data: {
                type: 'newPost',
                userId: follower.id,
                actionById: session?.id,
                content: `${session?.username || session?.name} posted a new post named ${title}.`,
                postId: postId,
            },
        });
    });

    await Promise.all(notificationPromises);
}




export async function PUT(request: any) {
    const session: ISession = await getServerSession(authOptions as AuthOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized', status: 401 })
    }
    const formData = await request.formData()


    const postId = formData.get('id')
    const title = formData.get('title')
    const content = formData.get('content')
    const imageUrl = formData.get('imageUrl')
    const relatedTags = formData.get('relatedtags')
    const newTags = formData.get('newTags')


    const currentTag = await prisma.tag.findFirst({
        where: {
            id: JSON.parse(relatedTags)[0]
        }
    })

    const createdTags = await Promise.all(
        JSON.parse(newTags).map(async (tag: string) => {
            const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
            return await prisma.tag.create({
                data: {
                    name: capitalizedTag,
                },
            });
        })
    );
    const allTagIds = [
        ...JSON.parse(relatedTags),
        ...createdTags.map((tag) => tag.id),
    ];



    const editPost = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            title,
            content,
            image: imageUrl,
            relatedTags: allTagIds,
            currentTagName: currentTag?.name,
            readingTime: Math.ceil(content.length / 1300) > 1 ? Math.ceil(content.length / 1300) : 1,
        }
    })


    return NextResponse.json({
        data: editPost
    }, { status: 200 })


}



export async function DELETE(req: NextRequest, res: NextResponse) {

    const session: ISession = await getServerSession(authOptions as AuthOptions)
    const { id: postId } = await req.json()


    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.comment.deleteMany({
        where: {
            postId: postId
        }
    })
    const users = await prisma.user.findMany({
        where: {
            OR: [
                {
                    savedPosts: {
                        has: postId
                    }
                },
                {
                    likedPosts: {
                        has: postId
                    }
                }
            ]
        }
    });

    for (const user of users) {
        const updatedSavedPosts = user.savedPosts.filter(post => post !== postId);
        const updatedLikedPosts = user.likedPosts.filter(post => post !== postId);

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                savedPosts: updatedSavedPosts,
                likedPosts: updatedLikedPosts,
            }
        });
    }

    await prisma.notification.deleteMany({
        where: {
          postId: postId,
        },
      });
      
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })
    for (const block of JSON.parse(post?.content as string).blocks) {
        if (block.type === 'image') {
            await deleteFileFromS3(block.data.file.url.split('/').pop(), 'posts')
        }
    }

    await prisma.post.delete({
        where: {
            id: postId
        }
    })



    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });

}