"use client"
import { SavedPostPageSpinner } from '@/components/saved-posts/loading/saved-post-page-spinner'
import EditPost from '@/sections/edit-post/view'
import { useGetPost } from '@/services/queries'
import { ISession } from '@/types/session'
import { useSession } from 'next-auth/react'

export default function EditPostPage({ params }: { params: { slug: string } }) {
    const { data: session } = useSession() as { data: ISession }
    const { post, postLoading, isError } = useGetPost(params.slug)

    if (postLoading || !session) return <SavedPostPageSpinner />

    if (isError) return <div>Something went wrong</div>

    return post && session?.id === post?.authorId ? (
        <EditPost post={post} />
    ) : (
        <div className='mt-2 ' >
            <p>
                You cannot edit this post
            </p>
            <button className='bg-violet-500 hover:bg-violet-700 text-white font-bold py-1 px-3 text-sm rounded mt-3' >
                <a href={`/`}>Go to home</a>
            </button>
        </div>
    )
}