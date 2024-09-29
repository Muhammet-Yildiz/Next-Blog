import { useRouter } from 'next/navigation'
import React from 'react'
import slugify from 'slugify'
import Output from 'editorjs-react-renderer';
import { FiSlack } from 'react-icons/fi'
import { IPost } from '@/types/post';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { filterParagraphBlocks } from '../post-detail/post-content-styles';
import { DeletePostButton } from '../delete-post-button';
import { ISession } from '@/types/session';
import { useSession } from 'next-auth/react';
import { CustomUserImage } from '../custom-user-image';


export const AboutPostItem = ({ post }: { post: IPost }) => {
    const { data: session } = useSession() as { data: ISession }
    const router = useRouter()

    const filteredContent = filterParagraphBlocks(JSON.parse(post.content));

    return (
        <div className='flex  mb-7  dark:border-zinc-700/50 pb-7   bordesr-2 flex-row space-x-5  border-b border-gray-200  pl-2 justify-between'>

            <div className={` w-7/12 space-y-2 `} >
                <div className={`flex gap-2 items-center `} >
                    <CustomUserImage src={post?.author.image} alt="profile" className="rounded-full w-[16px] h-[16px]" />
                    <span className='font-medium  text-[11px] dark:text-zinc-300'>
                        {post.author.username || post.author.name}
                    </span>

                    {post?.author.email === session?.email &&
                        <>
                            <div className='flex-grow' />

                            <button className="text-[9.8px] font-semibold text-gray-600 border  rounded-md py-1  px-3 cursor-pointer  transition-all duration-300 ease-in-out hover:text-gray-900 mt-1 dark:border-zinc-600 dark:text-zinc-400"

                                onClick={() => router.push(`/edit/${slugify(post.title, {
                                    lower: true,
                                    strict: true
                                })}--${post.id}`)}
                            >Edit</button>
                            <DeletePostButton post={post} />
                        </>
                    }

                </div>

                <div className={`font-extrabold text-gray-800  line-clamp-1 text-[15px] cursor-pointer dark:text-zinc-300`}
                    onClick={() => {
                        router.push(`/post/${slugify(post.title, {
                            lower: true,
                            strict: true
                        })}--${post.id}`)
                    }} >
                    {post.title}
                </div>

                <div className='font-medium text-gray-800 line-clamp-2 min-h-[45px] text-[12px] dark:text-zinc-400'>
                    <Output
                        data={filteredContent}
                    />
                </div>

                <div className={`flex gap-2 items-center text-gray-600 dark:text-gray-400 pt-2  text-[10px]`} >
                    <p>
                        <FiSlack size={14} className='text-violet-600 pb-[2px]' />
                    </p>
                    <p>
                        {post.readingTime}   min read
                    </p>
                    <p> • </p>
                    <p>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </p>
                </div>

            </div>
            <div className='w-5/12 relative h-[130px] sm:max-w-[220px] cursor-pointer '
                onClick={() => {
                    router.push(`/post/${slugify(post.title, {
                        lower: true,
                        strict: true
                    })}--${post.id}`)
                }}>
                <LazyLoadImage
                    src={post?.image || '/post.png'}
                    alt='image'
                    className='rounded-sm   w-[100%] h-[100%] object-cover'
                    placeholderSrc={
                        post?.image || '/post.png'
                    }
                    wrapperClassName='rounded-sm  '
                    loading='lazy'
                    effect='blur'
                    key={post.id}
                    wrapperProps={{
                        style: {
                            transitionDelay: "250ms",
                            transitionDuration: "300ms",
                            transitionTimingFunction: "ease-in",
                        },
                    }}
                />

            </div>

        </div>
    )
}  