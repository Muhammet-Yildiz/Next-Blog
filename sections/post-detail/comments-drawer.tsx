import React, { useState } from "react";
import { clsx } from "clsx";
import { FaTimes } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { ISession } from "@/types/session";
import { useCreateComment } from "@/services/mutations";
import { CommentList } from "@/components/post-detail/comment-list";
import { useGetPost } from "@/services/queries";
import { CustomUserImage } from "@/components/custom-user-image";
import { useSWRConfig } from "swr";

type CommentsDrawerProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    postId: string;
    comments: any[];
};
export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({ open, setOpen, postId, comments }) => {
    const { data: session } = useSession() as { data: ISession };
    const [isWriting, setIsWriting] = useState(true);
    const [content, setContent] = useState("")
    const { mutate: mutateGetPost } = useGetPost(`title--${postId}`)
    const { trigger, isMutating } = useCreateComment()
    const { cache } = useSWRConfig()
    const createComment = () => {
        if (!session || !content) return

        trigger({
            postId: postId,
            content: content
        }).then(() => {
            const cacheKeysArray = Array.from(cache.keys());
            cacheKeysArray.forEach(key => {
                if (key.startsWith('/posts?')) {
                    cache.delete(key);
                }
            });

            setContent("")
            setIsWriting(false)
            mutateGetPost()
            toast.success("Comment added successfully")
        }).catch((e) => {
            console.error('Yorum oluşturulurken bir hata oluştu:', e);
            toast.error("Something went wrong , please try again later")
        })

    }

    return (
        <div
            id={`dialog-right`}
            className="relative z-[1000] "
            aria-labelledby="slide-over"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(!open)}
        >
            <div className={clsx("fixed inset-0 bg-slate-900 bg-opacity-20 transition-all", { "opacity-100 duration-500 ease-in-out visible": open },
                { "opacity-0 duration-500 ease-in-out invisible": !open })}
            >
            </div>
            <div className={clsx({ "fixed inset-0": open })}>
                <div className="absolute inset-0   ">
                    <div className="pointer-events-none fixed  inset-y-0 right-0 w-96  overflow-y-auto  overflow-x-hidden   ">
                        <div className={`${open ? "translate-x-0" : "translate-x-full"}  pointer-events-auto relative w-full h-full transform transition ease-in-out duration-500`}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                            }}
                        >
                            <div className="flex flex-col h-full overflow-y-auto bg-white p-5  shadow-xl dark:bg-black dark:border dark:border-zinc-800/90">
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-bold text-gray-800  dark:text-neutral-200 "
                                        >
                                            Comments ({comments?.length})
                                        </h2>
                                        <button
                                            onClick={() => setOpen(false)}
                                            className="text-gray-500 dark:text-gray-400"
                                        >
                                            <FaTimes className="text-[18px] cursor-pointer" />
                                        </button>
                                    </div>
                                    {
                                        session ?
                                            <div className="mt-4 shadow-md  px-4 rounded-md bg-gray-50 dark:bg-zinc-800/70 cursor-pointer  transition-all duration-300 ease-in-out  " >
                                                <div className={`flex items-center gap-2 ${isWriting ? "block pt-3" : "hidden"}`} >


                                                    <CustomUserImage src={session?.image} alt="profile" className="w-6 h-6 rounded-full" />

                                                    <p className="text-gray-800 dark:text-gray-400 text-sm ml-1 ">
                                                        {session?.username}
                                                    </p>
                                                </div>


                                                <div className="mt-3">

                                                    <textarea
                                                        placeholder="What are your thoughts?"
                                                        className=
                                                        {`block w-full ${isWriting ? "h-24 pt-2 " : "h-11 pt-4"} "   rounded-md   bg-gray-50 dark:bg-transparent resize-none outline-none   text-[12px]   text-gray-800 dark:text-gray-200   `}
                                                        onFocus={() => setIsWriting(true)}
                                                        onChange={(e) => setContent(e.target.value)}
                                                        value={content} ></textarea>

                                                    {
                                                        isWriting &&
                                                        <div className={`  flex justify-end mt-1 gap-4 pb-2 ${isWriting ? "block" : "hidden"} `}>
                                                            <button className=" rounded-md text-[12px]"
                                                                onClick={() => setIsWriting(false)}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button className={`  ${content.length > 0 && !isMutating ? "bg-violet-700 hover:bg-violet-800" : "bg-gray-300 dark:bg-zinc-700 cursor-default"} text-white px-3 py-[5px] text-[12px] rounded-3xl   transition-all duration-300 ease-in-out `}
                                                                onClick={() => isMutating ? null : createComment()}
                                                            >
                                                                Respond
                                                            </button>
                                                        </div>
                                                    }

                                                </div>

                                            </div>

                                            :

                                            <div className="my-8    border-b border-gray-200 dark:border-gray-700 pb-4  dark:border-zinc-800/90  " >
                                                <p className="text-gray-800 dark:text-gray-300 text-sm ml-1 ">
                                                    💬 Please log in to comment
                                                </p>

                                                <div className="mt-3">

                                                    <button
                                                        className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-[5px] text-[12px] rounded-md   transition-all duration-300 ease-in-out mt-3 ml-2 "
                                                        onClick={() => signIn('google')}
                                                    >
                                                        Log In
                                                    </button>
                                                </div>

                                            </div>

                                    }

                                    <CommentList comments={comments} postId={postId} />

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};