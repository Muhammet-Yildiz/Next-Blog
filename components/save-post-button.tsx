import { useState } from "react";
import { useSavePost } from "@/services/mutations";
import { IPost } from "@/types/post";
import { ISession } from "@/types/session";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsBookmarkPlus } from "react-icons/bs";
import { BsBookmarkCheckFill } from "react-icons/bs";

export const SavePostButton = ({ post }: { post: IPost }) => {
    const { data: session, update: updateSession } = useSession() as { data: ISession  , update: (session: ISession) => void };
    const [savedPostsIds, setSavedPostsIds] = useState(session ? session?.savedPosts : [])

    const router = useRouter()

    const { trigger: saveTrigger ,isMutating} = useSavePost()

    const handleSavePost = async () => {
        if (!session) {
            router.push('/login')
            return
        }

        saveTrigger(
            {
                id: post.id
            },
            {
                optimisticData: savedPostsIds.includes(post.id) ? setSavedPostsIds(savedPostsIds.filter((id: string) => id !== post.id)) :
                    setSavedPostsIds([...savedPostsIds, post.id]),
                rollbackOnError: true,
                onSuccess: () => {
                    updateSession({
                        ...session,
                        savedPosts: savedPostsIds
                    });
                }
            }
        )

    }

    return (
        <div onClick={() => handleSavePost()}   >

            {
                session && savedPostsIds.includes(post.id) ?
                    <BsBookmarkCheckFill className= {`
                        ${isMutating ? 'cursor-default text-gray-300 dark:text-gray-600 ' : 'cursor-pointer text-violet-500 hover:text-violet-500'} text-[17px]   `}
                    /> :
                    <BsBookmarkPlus className={`
                        ${isMutating ? '!cursor-default text-gray-300 dark:text-gray-600' : 'cursor-pointer text-gray-600 dark:text-gray-400 hover:text-violet-600'} cursor-pointer text-[17px]  `}
                    />
            }

        </div>
    )
}