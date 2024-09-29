import { useGetPopularPosts, useGetTopics } from "@/services/queries";
import Output from "editorjs-react-renderer";
import { filterParagraphBlocks } from "../post-detail/post-content-styles";
import { FaTag } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { ISession } from "@/types/session";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import Image from "next/image";

export const InitialSearchDisplay = ({ handleClose }: { handleClose: () => void }) => {
    const router = useRouter();
    const { topics } = useGetTopics('userPreferred');
    const { posts } = useGetPopularPosts();
    const { data: session } = useSession() as { data: ISession };

    return (
            <>
                {!!topics.length  &&
                    <>
                        <p className="text-[13px] font-semibold text-gray-600 mb-4 dark:text-neutral-300" >
                            Recommended Topics
                        </p>
                        <div className="flex flex-wrap gap-3"   >

                            {topics.map((topic) => (

                                <div key={topic.id}
                                    className="inline-flex  items-center mb-1 -pointer bg-white px-2 py-[0.3rem] rounded-md cursor-pointer dark:bg-zinc-900"
                                    onClick={() => {
                                        router.push(`/?tag=${topic.name}`)
                                        handleClose()
                                    }}
                                >
                                    <FaTag size={12}
                                        className="text-violet-500 mr-2"
                                    />
                                    <p className="text-[11.6px] font-semibold text-gray-600 dark:text-gray-400" >
                                     
                                        {topic?.name}
                                    </p>

                                </div>

                            ))}
                        </div>

                    </>
                }

                {!!posts.length  &&
                    <>
                        <p className="text-[13px] font-semibold text-gray-600 mb-5 mt-5 dark:text-neutral-300" >
                         {session &&( (session?.username || session?.name) + ' ,')} Popular Posts for you
                        </p>

                        {
                            posts.map((post) => (
                                <div key={post.id}
                                    className="flex  items-center mb-3 cursor-pointer  bg-white px-1 py-[0.3rem] rounded-md dark:bg-zinc-900 "
                                    onClick={() => {
                                        router.push(`/post/${slugify(post.title, {
                                            lower: true,
                                            strict: true
                                        })}--${post.id}`)
                                        handleClose()
                                    }}
                                >
                                    <Image src={post?.image || '/post.png'}
                                        className=' object-contain !w-20 h-16 rounded-sm bg-slate-100   !min-w-20 mr-4 dark:bg-zinc-700/80'
                                        alt='post'
                                        width={80}
                                        height={64}
                                    />

                                    <div className="ml-3" >
                                        <p className="text-[13px] font-semibold text-gray-600 dark:text-neutral-300"
                                        >
                                            {post?.title}
                                        </p>


                                        <p className='text-zinc-500 text-[9.7px] pr-2   line-clamp-2 mb-[6px] dark:text-neutral-400' >
                                            <Output data={filterParagraphBlocks(JSON.parse(post.content))} />
                                        </p>
                                    </div>

                                </div>
                            ))
                        }
                    </>
                }

            </>
    )
}