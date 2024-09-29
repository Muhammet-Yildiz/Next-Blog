import { useGetPost } from "@/services/queries";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CommentsDrawer } from "./comments-drawer";
import { FiSlack } from 'react-icons/fi'
import { FollowButton } from "@/components/follow-button";
import { DeletePostButton } from "@/components/delete-post-button";
import { ISession } from "@/types/session";
import { useSession } from "next-auth/react";
import { CustomUserImage } from "@/components/custom-user-image";
import { FaRegComment } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { ApplauseButton } from "@/components/applause-button";
import { SavePostButton } from "@/components/save-post-button";

export const PostDetailsHeader = ({ slug, displayAuthorInfo }: { slug: string, displayAuthorInfo?: boolean }) => {

    const { data: session } = useSession() as { data: ISession }
    const router = useRouter()
    const searchParams = useSearchParams()

    const [drawerOpen, setDrawerOpen] = useState<boolean>(!!searchParams.get('open'))

    const { post } = useGetPost(slug)

    function formatNumber(num: number) {
        if (num >= 1000) {
            return (Math.floor(num / 10) / 100).toFixed(1) + 'K';
        } else {
            return num.toString();
        }
    }


    return (
        <>
            <CommentsDrawer
                open={drawerOpen}
                setOpen={setDrawerOpen}
                postId={post?.id}
                comments={post?.comments}
            />

            {displayAuthorInfo && <div className="flex items-center justify-between  my-5" >
                <div className="flex items-center  space-x-3 w-full">

                    <CustomUserImage src={post?.author?.image} alt="profile" className="rounded-full  w-[2.35rem] h-[2.35rem] mt-1" />


                    <div className="flex-grow ">
                        <div className="flex items-center gap-3  ">
                            <h6 className="text-[13px] font-semibold text-slate-700 cursor-pointer dark:text-zinc-300"
                                onClick={() => router.push(`/about/@${post?.author?.email.split('@')[0]}`)}
                            >
                                {post?.author?.username || post?.author?.name}

                            </h6>
                            <FollowButton post={post} />

                            {post?.author?.email === session?.email &&
                                <>
                                    <div className='flex-grow ' />

                                    <button className="text-[9.8px] font-semibold text-gray-600 border  rounded-md py-1  px-3 cursor-pointer  transition-all duration-300 ease-in-out hover:text-gray-900 mt-1 dark:border-zinc-600 dark:text-zinc-400 "
                                        onClick={() => router.push(`/edit/${slug}`)}
                                    >Edit</button>

                                    <DeletePostButton post={post} />

                                </>
                            }
                        </div>

                        <div className="text-[11px] text-gray-500  flex gap-2 pt-[3px] items-center">
                            <p>
                                <FiSlack size={9} className='text-violet-600  ' />
                            </p>
                            <p>
                                {post?.readingTime}   min read
                            </p>

                            <p> • </p>
                            <p   >
                                {
                                    new Date(post?.createdAt).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })
                                }
                            </p>

                        </div>

                    </div>
                </div>

            </div>
            }
            <div className="flex items-center   gap-3   border-b  border-t border-[#f1efef]  py-4 mb-6 dark:border-zinc-800/70"  >

                <ApplauseButton post={post}   />
                <div className='flex gap-2 items-center ml-3 pt-1' onClick={() => setDrawerOpen(true)}  >
                    <FaRegComment className=' text-slate-500 dark:text-gray-400 text-[15px] hover:text-violet-600 cursor-pointer  ' />

                    <p className='text-gray-500  text-sm dark:text-gray-400  font-normal '>
                        {post?.comments?.length}
                    </p>
                </div>

                <div className='flex gap-2 items-center mx-2 relative pt-1  ml-3 '   >
                    <FaRegEye className='  text-gray-500 dark:text-gray-400 text-[17px] hover:text-violet-600 cursor-pointer ' />
                    <p className='text-gray-500  text-sm dark:text-gray-400  font-normal '>
                        {formatNumber(post?.viewCount || 0)}
                    </p>
                </div>
                <div className="flex-grow" />
                <div
                    className="pt-1 flex gap-3 items-center pr-1"
                >
                    <SavePostButton post={post} />
                    <HiDotsHorizontal className='text-gray-500 dark:text-gray-400 cursor-pointer text-[18px] hover:text-violet-600 ml-2' />
                </div>
            </div>

        </>

    )
}