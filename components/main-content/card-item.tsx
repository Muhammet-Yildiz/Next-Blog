import { useRouter } from 'next/navigation'
import Output from 'editorjs-react-renderer'
import slugify from 'slugify'
import { IPost } from '@/types/post'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { CardItemStats } from './card-item-stats'
import { filterParagraphBlocks } from '../post-detail/post-content-styles'
import { CustomUserImage } from '../custom-user-image'
type Props = {
    viewAs: 'grid' | 'list',
    post: IPost
    variant?: 'recommended'
}

export const CardItem: React.FC<Props> = ({ viewAs, post,variant }) => {

    const router = useRouter()

    const filteredContent = filterParagraphBlocks(JSON.parse(post.content));

    return (
        <div className={` flex mb-7   dark:border-zinc-800/80 pb-7  ${viewAs === 'grid' ? 'sm:w-6/12 w-10/12  flex-col sm:odd:pr-5  sm:even:pl-5' :
        'flex-row space-x-5   border-b border-gray-200 '}`}  >
            <div className={`${viewAs === 'grid' ? 'w-full' : ' w-5/12 '} relative h-[220px] sm:min-w-[250px] cursor-pointer`}
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
                    className={`${variant && 'p-9 pl-0' } rounded-sm  h-full`}
                    placeholderSrc={post?.image || '/post.png'}
                    wrapperClassName='rounded-sm  '
                    loading='lazy'
                    effect='blur'
                    key={post.id}
                    height={220}
                    width={'100%'}
                    wrapperProps={{
                        style: {
                            transitionDelay: "250ms",
                            transitionDuration: "300ms",
                            transitionTimingFunction: "ease-in",
                        },
                    }}
                />

            </div>

            <div className={` ${viewAs === 'grid' ? 'w-full space-y-2  mt-3' : 'w-7/12 space-y-3   mt-1'}  `} >

                <div className={`flex gap-2 items-center${viewAs === 'grid' && 'my-3'}`} >
                    <CustomUserImage  src={post?.author.image} alt="profile" className="rounded-full w-[17px] h-[18px]" />
                    <span
                        className='font-medium   text-[11px] cursor-pointer dark:text-gray-400'
                        onClick={() => router.push(`/about/@${post.author.email.split('@')[0]}`)}
                    >
                        {post.author.username || post.author.name }
                    </span>

                </div>
                <div className={`font-extrabold text-gray-800 dark:text-gray-200   line-clamp-1  cursor-pointer `}
                    onClick={() => {
                        router.push(`/post/${slugify(post.title, {
                            lower: true,
                            strict: true
                        })}--${post.id}`)
                    }}
                >
                    {post.title}
                </div>
                <div className={`font-medium text-gray-800 dark:text-gray-300  line-clamp-2 min-h-[43px]   max-h-[43px] 
                ${viewAs === 'grid' ? ' text-[12px]' : ' text-[13px]'} font-["Inter"] `}
                >
                    <Output
                        data={filteredContent}
                    /> selam
                </div>

                <CardItemStats
                    post={post}
                    viewAs={viewAs}

                />
            </div>

        </div>
    )
}