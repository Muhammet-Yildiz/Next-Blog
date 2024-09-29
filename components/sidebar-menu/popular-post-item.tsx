import { IPost } from '@/types/post'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import { CustomUserImage } from '../custom-user-image'

export const PopularPostItem = ({ post }: { post: IPost }) => {

    const router = useRouter()

    return (
        <div className='flex flex-col  mb-3'>

            <div className='flex gap-1 items-center '>

                <CustomUserImage src={post?.author?.image} alt="profile" className="rounded-full  w-[13px] h-[13px]  mr-[3px] " />

                <div className='font-normal text-[10px] text-gray-900 dark:text-gray-400 pt-[3px] cursor-pointer '
                    onClick={() => router.push(`/about/@${post.author.email.split('@')[0]}`)}
                >
                    {post.author.username || post.author.name} ·  {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    })}
                </div>

            </div>

            <h6 className=' line-clamp-2  leading-[16px] dark:text-gray-400  text-zinc-600 text-[11.6px] my-[5px] font-bold cursor-pointer hover:text-zinc-700 transition-colors duration-300 ease-in-out '

                onClick={() => {
                    router.push(`/post/${slugify(post.title, {
                        lower: true,
                        strict: true
                    })}--${post.id}`)
                }}
            >
                {post.title}
            </h6>
        </div>
    )
}