import { useFollowUser } from "@/services/mutations";
import { useGetUserAbout } from "@/services/queries";
import { IPost } from "@/types/post"
import { ISession } from "@/types/session";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

type Props = {
    post: IPost
    styleVariant?: 'largeBtn' | 'smallBtn'
}

export const FollowButton: React.FC<Props> = ({ post, styleVariant }) => {
    const { data: session, update } = useSession() as { data: ISession, update: any };
    const router = useRouter()

    const [followingStatus, setFollowingStatus] = useState(false)

    const subEmail = session?.email.split('@')[0]

    const { mutate: mutateAbout } = useGetUserAbout(subEmail);

    const { trigger, isMutating } = useFollowUser()


    useEffect(() => {
        if (session) {
            setFollowingStatus(session?.followingIDs.includes(post?.authorId))
        }
    }, [session, post?.authorId])


    const handleFollowUser = () => {
        if (!session) {
            router.push('/login')
            return
        }
        trigger(
            {
                userId: post.authorId
            },
            {
                optimisticData: setFollowingStatus(!followingStatus),
                rollbackOnError: true,
                onSuccess: () => {
                    update({
                        ...session,
                        followingIDs: followingStatus ? session?.followingIDs.filter((id) => id !== post.authorId) : [...session?.followingIDs, post.authorId]
                    });

                    mutateAbout()
                }
            },

        )
    }


    return (

        post.authorId !== session?.id &&
        <>
            {
                styleVariant === 'largeBtn' ?

                    <button className={` px-5 py-2 rounded-2xl  text-[12px] font-medium  transition duration-300 ease-in-out border border-solid   
                    ${isMutating ?
                            ' bg-gray-300 text-gray-400  border-gray-300 ' :
                            followingStatus ? ' text-violet-600  border-violet-600 '
                                : 'bg-violet-600 text-white hover:bg-violet-700 border-violet-600'} `}

                        onClick={() => isMutating ? null : handleFollowUser()}
                    >
                        {followingStatus ? 'Unfollow' : 'Follow'}
                    </button>
                    :
                    <div onClick={() => isMutating ? null : handleFollowUser()}
                        className={` ${isMutating ? 'opacity-40 ' : 'opacity-100 '}`} >
                        {
                            followingStatus ?
                                <button className={`  text-xs font-semibold text-gray-600 border  rounded-md px-2 py-1   transition-all duration-300 ease-in-out hover:text-gray-900 dark:border-zinc-800/90  dark:text-gray-600
                            ${isMutating ? 'cursor-default' : 'cursor-pointer'} `}
                                >Following</button> :

                                <button className={` text-xs font-semibold text-violet-600 border rounded-md px-2 py-1   transition-all duration-300 ease-in-out hover:text-violet-700 dark:border-zinc-800/90  dark:text-violet-600/70 ${isMutating ? 'cursor-default' : 'cursor-pointer'} `}>Follow</button>
                        }
                    </div>
            }

        </>

    )
}