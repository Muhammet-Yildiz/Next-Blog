import { ISession } from '@/types/session'
import { IAbout } from '@/types/user'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, {useState } from 'react'
import { CustomUserImage } from '../custom-user-image'
type ModalController = {
    title: string;
    isOpen: boolean;
};
type FollowModalContentProps = {
    modalController: ModalController;
    followUser: (userId: string) => void;
    user: IAbout;
};


export const FollowModalContent: React.FC<FollowModalContentProps> = ({ followUser, modalController, user }) => {

    const { data: session } = useSession() as { data: ISession }
    const router = useRouter()
    const userList = modalController.title === 'Followers' ? user.followers : user.following
    const [followIds, setFollowIds] = useState<string[] | undefined>(session?.followingIDs)

    return (

        <div className="mt-4  p-8 pt-2">
            <div className="overflow-y-auto h-96">

                {userList.map((user) => (
                    <div key={user.id} className="flex justify-between items-center border-b border-gray-200 py-2 dark:border-zinc-800/80">
                        <div className="flex items-center">
                            <CustomUserImage src={user?.image} alt="profile" className="w-8 h-8 rounded-full" />

                            <p className="ml-5 text-sm text-gray-500 cursor-pointer   hover:text-violet-600 dark:text-neutral-400"
                                onClick={() => router.push(`/about/@${user.email.split('@')[0]}`)}

                            >{user.username || user.name}</p>
                        </div>
                        {session?.id !== user.id && <button
                            className={` px-5 py-2 rounded-2xl  text-[12px] font-medium  transition duration-300 ease-in-out border border-solid
                            border-violet-600  ${followIds?.find((item) => item === user.id) ? 'bg-white text-violet-600' : 'bg-violet-600 text-white'}`}
                            onClick={() => {
                                followUser(user.id)
                                followIds?.includes(user.id) ? setFollowIds(followIds.filter((item) => item !== user.id)) : setFollowIds([...followIds as string[], user.id])
                            }}
                        >
                            {followIds?.find((item) => item === user.id) ? 'Unfollow' : 'Follow'}
                        </button>
                        }
                    </div>
                ))}
            </div>
        </div>

    )
}