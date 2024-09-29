import { IPosts } from "@/types/post"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Highlighter from "react-highlight-words"
import slugify from "slugify"

type Props = {
    posts: IPosts,
    query: string,
    handleClose: () => void
}
export const SearchRelatedPosts: React.FC<Props> = ({ posts, query, handleClose }) => {
    const router = useRouter()
    return (
        !!posts.length && (

            <>
                <p className="text-[13px] font-semibold text-gray-600 mb-3 dark:text-neutral-300" >
                    Related Posts
                </p>

                {posts.map((post) => (
                    <>

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
                            <Image src={post?.image ? post.image : '/post.png'}
                                className=' mr-4 object-contain w-20 h-12 rounded-sm bg-slate-100 dark:bg-zinc-700/80'
                                alt='post'
                                width={80}
                                height={48}
                            />

                            <p className="text-[13px] font-semibold text-gray-600 dark:text-neutral-400" >
                                <Highlighter
                                    searchWords={[query]}
                                    textToHighlight={post?.title as string}
                                    autoEscape={true}
                                />
                            </p>
                            <div className="flex-grow" />
                            <p className="text-[11.2px]  text-gray-500 bg-violet-50 p-1 dark:bg-violet-900/45 dark:text-neutral-400" >
                                Post
                            </p>
                        </div>
                    </>

                ))}

            </>

        )
    )
}