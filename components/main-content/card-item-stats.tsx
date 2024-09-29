import { HiDotsHorizontal } from "react-icons/hi";
import { FiSlack } from 'react-icons/fi'
import { IPost } from "@/types/post";
import { useRouter, useSearchParams } from "next/navigation";
import { FaRegEye } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import slugify from 'slugify'
import { ApplauseButton } from "@/components/applause-button";
import { SavePostButton } from "../save-post-button";
type Props = {
    viewAs: 'grid' | 'list',
    post: IPost
}

export const CardItemStats: React.FC<Props> = ({ post, viewAs }) => {
    const currentTag = useSearchParams().get('tag');

    const router = useRouter()

    function formatNumber(num: number) {
        if (num >= 1000) {
            return (Math.floor(num / 10) / 100).toFixed(1) + 'K';
        } else {
            return num.toString();
        }
    }

    return (
        <>

            <div className={`flex gap-2 items-center text-gray-600 dark:text-gray-400 pt-2  ${viewAs === 'grid' ? 'text-[10px]' : 'text-[11px]'} `}>
                <p>
                    <FiSlack size={14} className='text-violet-600 pb-[2px] 
                    dark:text-violet-600/80 '  />
                </p>
                <p>
                    {post?.readingTime}   min read
                </p>
                <p> • </p>
                <p>

                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </p>
                {
                    post?.currentTagName &&
                    <>
                        <p> • </p>
                        <div
                            className='bg-gray-200 text-slate-900 px-2 py-1 rounded-xl
                            dark:bg-zinc-800 dark:text-zinc-400
                            text-[10px]'
                        >
                            {currentTag || post?.currentTagName}
                        </div>
                    </>

                }

            </div>
            <div className='flex gap-[0.6rem] items-center pt-4   rounded-md'>

                <ApplauseButton post={post} />


                <div className='flex gap-2 items-center ml-4 relative'
                    onClick={() => {
                        router.push(`/post/${slugify(post.title, {
                            lower: true,
                            strict: true
                        })}--${post.id}?open=true`)
                    }}
                >
                    <FaRegComment
                        className='  text-gray-500 dark:text-gray-400 text-[15px] hover:text-violet-600 cursor-pointer absolute top-[5px]' />
                    <p className='text-gray-500  text-sm dark:text-gray-400  font-normal ml-[26px] pt-[1.5px] tracking-wide'>
                        {post?.comments?.length}
                    </p>
                </div>

                <div className='flex gap-2 items-center ml-4 relative pt-1'  >
                    <FaRegEye
                        className='  text-gray-500 dark:text-gray-400 text-[16px] hover:text-violet-600 cursor-pointer ' />
                    <p className='text-gray-700  text-[13.2px] dark:text-gray-400  font-normal tracking-wide '>
                        {formatNumber(post.viewCount)}
                    </p>
                </div>

                <div className='flex-grow' />
                <SavePostButton post={post} />
                <HiDotsHorizontal className='text-gray-600 dark:text-gray-400 cursor-pointer text-[18px] hover:text-violet-600 ml-2' />
            </div>
        </>

    )
}