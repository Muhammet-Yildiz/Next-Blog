import { IPost } from '@/types/post'
import Output from 'editorjs-react-renderer'
import { useRouter } from 'next/navigation'
import { FiSlack } from 'react-icons/fi'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import slugify from 'slugify'
import { filterParagraphBlocks } from '../post-detail/post-content-styles'
import { SavePostButton } from '../save-post-button'
import { CustomUserImage } from '../custom-user-image'

export const SavedPostItem = ({ post }: { post: IPost }) => {

    const router = useRouter()

    const filteredContent = filterParagraphBlocks(JSON.parse(post.content));


    return (
        <div className=' flex  justify-between mb-7  dark:border-gray-700 pb-7   bordesr-2 bordser-green-600 ' >
            <div className={` w-7/12 space-y-2`} >
                <div className={`flex gap-2 items-center `} >

                    <CustomUserImage src={post?.author.image} className="rounded-full w-[18px] h-[18px]" alt='profile' />

                    <span className='font-medium  text-[11px] cursor-pointer dark:text-zinc-300 '
                        onClick={() => router.push(`/about/@${post.author?.email.split('@')[0]}`)}  >
                        {post.author.username || post.author.name}

                    </span>

                </div>

                <div className={`font-extrabold text-gray-800    line-clamp-1 text-[15px] cursor-pointer dark:text-zinc-300`}
                    onClick={() => {
                        router.push(`/post/${slugify(post.title, {
                            lower: true,
                            strict: true
                        })}--${post.id}`)
                    }}
                >
                    {post.title}
                </div>

                <div className={`font-medium text-gray-800    line-clamp-2 min-h-[45px]   text-[12px]  dark:text-zinc-400`} >
                    <Output data={filteredContent} />
                </div>

                <div className={`flex gap-2 items-center text-gray-600 dark:text-gray-400 pt-2  text-[10px]`}   >
                    <p>
                        <FiSlack size={14} className='text-violet-600 pb-[2px]' />
                    </p>
                    <p>
                        {post?.readingTime} min read
                    </p>
                    <p> • </p>
                    <p>

                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </p>
                    <p className='mx-2'> • </p>
                    <SavePostButton post={post} />
                </div>

            </div>
            <div className={` w-5/12 relative h-[130px] sm:max-w-[200px] cursor-pointer   `}
                onClick={() => {
                    router.push(`/post/${slugify(post.title, {
                        lower: true,
                        strict: true
                    })}--${post.id}`)
                }}
            >

                <LazyLoadImage
                    src={post?.image || '/post.png'}
                    alt='image'
                    className='rounded-sm  h-full w-full  '
                    placeholderSrc={post?.image || '/post.png'}
                    wrapperClassName='rounded-sm  object-cover '
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