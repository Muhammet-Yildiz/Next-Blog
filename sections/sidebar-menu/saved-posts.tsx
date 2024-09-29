import Link from 'next/link'
import { SectionTitle } from '@/components/sec-title'
import { SavedPostsLoadingSkeleton } from '@/components/sidebar-menu/loading-skeletons/saved-posts-skeleton'
import { useGetSavedPosts } from '@/services/queries'
import { filterParagraphBlocks } from '@/components/post-detail/post-content-styles'
import Output from 'editorjs-react-renderer'
import { CustomUserImage } from '@/components/custom-user-image'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import Image from 'next/image'


export const SavedPosts = () => {
    const router = useRouter()

    const { posts, postsLoading, isError } = useGetSavedPosts()

    if (postsLoading) return <SavedPostsLoadingSkeleton />

    if (isError) return <>There was a problem fetching the saved posts request</>

    return (
        <div>
            <SectionTitle title='Saved Posts' />
            {
                posts.length === 0 && !postsLoading && <div className='text-gray-500 dark:text-gray-400 text-[12px] pb-5  '>You have no saved posts yet.</div>
            }

            {!postsLoading && posts.slice(0, 2).map((post) => {
                const filteredContent = filterParagraphBlocks(JSON.parse(post.content));

                return (

                    <div className='mb-5 last-of-type:mb-2' key={post.id}>

                        <div className='flex gap-1 items-center pb-1 '>

                            <CustomUserImage src={post?.author.image} alt="profile" className="w-3 h-3 rounded-full mr-2" />
                            <p className='  dark:text-gray-200  text-[11px]  font-normal  text-black cursor-pointer'
                                onClick={() => router.push(`/about/@${post.author.email.split('@')[0]}`)}
                            >
                                {post.author.username || post.author.name}
                            </p>
                        </div>
                        <p className='text-zinc-700 text-[12px] mt-[3px] font-bold line-clamp-1 
                            dark:text-gray-400 cursor-pointer'
                            onClick={() => {
                                router.push(`/post/${slugify(post.title, {
                                    lower: true,
                                    strict: true
                                })}--${post.id}`)
                            }}
                            >
                            {post.title}
                        </p>
                        <div className='text-zinc-500 
                        dark:text-gray-500
                        text-[10px]  font-normal line-clamp-2 mb-[6px]' >
                            <Output data={filteredContent} />
                        </div>

                        <div className='font-light text-[9.6px] text-gray-900 dark:text-gray-400' >
                            {
                                new Date(post.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })
                            }
                            {' ·  '}
                            {post.readingTime} min read
                        </div>

                    </div>

                )

            })}


            {!postsLoading && posts.length > 0 && <div className='mb-4'>
                <Link href='/saved-posts'
                    className='text-[10px] text-violet-600 font-medium pb-2 dark:text-violet-600/90'
                >
                    See all ({posts?.length})
                </Link>
            </div>}

          
            <div className='text-gray-500 dark:text-gray-400 text-[10px] pb-2 pt-3 border-t border-slate-100 dark:border-zinc-800/80'>
                Crafted with a little help from the
                <Image 
                    src="/ghost.gif"
                    alt="ghost"
                    width={20}
                    height={20}
                    className='w-6 h-6 inline mx-1 mb-[0.2rem]'
                    unoptimized
                />
                <br />

                by
                <Link
                    href='https://github.com/Muhammet-Yildiz'
                    className='text-violet-600 font-medium ml-1 dark:text-violet-600/90'
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Muhammet Yıldız
                </Link>
            </div>

        </div>
    )
}