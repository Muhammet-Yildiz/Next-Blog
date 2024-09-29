import { IComment } from "@/types"
import { ISession } from "@/types/session";
import { useSession } from "next-auth/react";
import { FaDeleteLeft } from "react-icons/fa6";
import { useGetPost } from "@/services/queries";
import { useDeleteComment } from "@/services/mutations";
import toast from "react-hot-toast";
import { CustomUserImage } from "../custom-user-image";
import { useSWRConfig } from "swr";

export const CommentList = ({ comments, postId }: { comments: IComment[], postId: string }) => {
    const { data: session } = useSession() as { data: ISession };
    const { cache } = useSWRConfig()

    const { mutate: mutateGetPost } = useGetPost(`title--${postId}`)
    const { trigger, isMutating } = useDeleteComment();

    const handleDeleteComment = (commentId: string) => {
        trigger({
            id: commentId
        }).then(() => {
            toast.success("Comment deleted successfully")
            mutateGetPost()
            const cacheKeysArray = Array.from(cache.keys());
            cacheKeysArray.forEach(key => {
                if (key.startsWith('/posts?')) {
                    cache.delete(key);
                }
            });
        }).catch(() => {
            toast.error("Something went wrong , please try again later")
        })

    }

    return (
        <div className="mt-8">
            {
                comments?.length > 0 ? comments?.map((comment, index) => (
                    <div key={index} className="mt-4 bg-violet-50 dark:bg-zinc-800/60 p-3 rounded-md shadow-md">
                        <div className="flex items-center gap-2 relative  ">

                            <CustomUserImage src={comment.author.image}
                                className="w-7 h-7 rounded-full mt-1 mr-1" />

                            <div className="pt-1">
                                <p className="text-gray-800 dark:text-gray-200 text-[0.8rem]">
                                    {comment?.author.username}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-[11px]">

                                    {
                                        new Date(comment.createdAt).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )
                                    }
                                </p>
                            </div>
                            {
                                session?.id === comment.author.id &&
                                <FaDeleteLeft
                                    className={`dark:text-gray-400  right-0  top-2 absolute    ${isMutating ? "text-gray-300 dark:text-zinc-500 " : "text-violet-400 hover:text-violet-500 cursor-pointer"}  text-[18px] 
                                    `}
                                    onClick={() => isMutating ? null :
                                        handleDeleteComment(comment.id)}
                                />
                            }

                        </div>
                        <pre className="mt-2 text-gray-800 dark:text-gray-200 text-[12px] p-2  font-sans word-break whitespace-pre-wrap">
                            {comment.content}
                        </pre>

                    </div>
                ))

                    :
                    session && <p className="text-gray-600 dark:text-gray-400 text-[12px] bg-violet-100 dark:bg-gray-800 p-3 rounded-md shadow-md">💬 No comments so far. Be the first to share your thoughts</p>
            }
        </div>
    )
}