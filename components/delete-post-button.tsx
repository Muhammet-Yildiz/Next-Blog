import { IPost } from "@/types/post";
import { ISession } from "@/types/session";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ActionModal } from "./action-modal";
import { useState } from "react";
import { useDeletePost } from "@/services/mutations";
import { useGetUserAbout } from "@/services/queries";
import toast from "react-hot-toast";
import { FaExclamationTriangle } from "react-icons/fa";
import { useSWRConfig } from "swr";

export const DeletePostButton = ({ post }: { post: IPost }) => {
    const { data: session } = useSession() as { data: ISession };
    const router = useRouter()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const subEmail = session?.email?.split('@')[0]

    const { mutate: mutateAbout } = useGetUserAbout(subEmail)
    const { cache, } = useSWRConfig()

    const { trigger, isMutating } = useDeletePost()

    const handleDeletePost = () => {
        trigger({
            id: post.id
        },
            {
                optimisticData: true
            }
        ).then(() => {
            setIsOpen(false)
            toast.success('Post deleted successfully')
            mutateAbout()
            const cacheKeysArray = Array.from(cache.keys());
            cacheKeysArray.forEach(key => {
                if (key.startsWith('/posts?')) {
                    cache.delete(key);
                }
            });

            if (pathname.startsWith('/post')) {
                router.push(`/about/@${session?.email.split('@')[0]}?confetti=true`)
            }
        }).catch((error) => {
            console.log(error)
            toast.error("Error deleting post")
        })
    }

    return (
        <>
            <button className="text-[9.8px] font-semibold text-violet-500 border border-violet-200  rounded-md py-1  px-3 cursor-pointer  transition-all duration-300 ease-in-out hover:text-violet-600 mt-1 dark:border-zinc-600"
                onClick={() => setIsOpen(true)}
            >Delete</button>
            <ActionModal
                isOpen={isOpen}
                variant="post_delete"
                content={
                    <div className=" flex flex-col  items-center" >

                        <FaExclamationTriangle
                            size={55}
                            className="text-violet-600 mt-8 mb-4 bg-violet-200 p-3 rounded-md"
                        />
                        <h3 className="text-xl font-bold p-5 "   >
                            Are you sure ?
                        </h3>

                        <div className="px-8 pt-3 pb-8 text-center " >

                            Do you really want to delete the post titled  <strong className="text-violet-500 px-1">
                                {post.title}
                            </strong>?
                            <br />
                            This process cannot be undone.
                        </div>
                        <div className="flex flex-col   pt-1 pb-8  w-full px-5">
                            <button
                                onClick={() => {
                                    !isMutating && handleDeletePost()
                                }}
                                className={` ${isMutating ? "cursor-default bg-gray-300" : "cursor-pointer bg-violet-600 hover:bg-violet-700"}
                                    text-[12px] border font-bold    rounded-md p-3 transition   text-white mb-3  `} >
                                Delete Post
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className=" cursor-pointer text-[12px] border font-bold   rounded-md p-3  transition   bg-gray-600  text-white"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                }
                handleClose={() => setIsOpen(false)}
            />

        </>

    )
}