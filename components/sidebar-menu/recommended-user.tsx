import { useRouter } from 'next/navigation'
import { RiUserFollowLine } from 'react-icons/ri'
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { IBasicUser } from '@/types/user';
import { useFollowUser } from '@/services/mutations';
import { CustomUserImage } from '../custom-user-image';
import { ISession } from '@/types/session';
import { useGetUserAbout } from '@/services/queries';


export const RecommendedUser = ({ user }: { user: IBasicUser }) => {

    const { data: session, update } = useSession() as { data: ISession, update: any };
    const sessionSubEmail = session?.email.split('@')[0]
    const subEmail = user.email.split('@')[0]
    const router = useRouter()
    const { trigger, isMutating } = useFollowUser()

    const [followingUsers, setFollowingUsers] = useState<string[]>(session?.followingIDs || [])

    const { mutate: mutateAbout } = useGetUserAbout(subEmail)
    const { mutate: mutateSessionAbout } = useGetUserAbout(sessionSubEmail)


    const handleFollowUser = (userId: string) => {
        if (!session) {
            router.push('/login')
            return
        }
        trigger(
            {
                userId
            },
            {
                optimisticData: followingUsers.includes(userId) ? setFollowingUsers(followingUsers.filter((id: string) => id !== userId)) : setFollowingUsers([...followingUsers, userId]),
                rollbackOnError: true,
                onSuccess: () => {
                    mutateAbout()
                    mutateSessionAbout()
                    update({
                        ...session,
                        followingIDs: session?.followingIDs.includes(userId) ? session?.followingIDs.filter((id) => id !== userId) : [...session?.followingIDs, userId]
                    });

                }
            }
        )

    }


    return (
        <div className='flex items-start  mt-2 border-b border-zinc-100
        dark:border-zinc-900 pb-2 gap-1 relative '>
            <CustomUserImage src={user?.image} alt="profile" className="rounded-full  w-[27px] h-[27px] mr-2 pt-1" />


            <div className='flex flex-col w-[calc(100%-76px)]    '>
                <h6 className='font-semibold text-[12px] text-zinc-800
                dark:text-gray-400 flex-shrink
                pb-[2px] cursor-pointer '
                    onClick={() => router.push(`/about/@${user.email.split('@')[0]}`)} >
                    {user.username || user.name}
                </h6>
                <p className='text-[10px] text-gray-600  dark:text-gray-500  font-normal line-clamp-2  pr-1 '>
                    {user.info || 'No bio yet'}
                </p>
            </div>

            <button className={` px-2 py-2 text-xs font-semibold     transition duration-150 ease-linear self-center rounded-sm  border  group  dark:border-zinc-700 flex-shrink-0
                        ${isMutating ? 'bg-gray-200 dark:bg-gray-800 dark:text-zinc-800 cursor-default' :
                    followingUsers.includes(user.id) ? 'bg-violet-600 dark:bg-slate-800 text-white ' : 'text-zinc-600  hover:border-violet-300  hover:text-white hover:bg-violet-200 dark:hover:bg-zinc-800/80'}  '} `}
                onClick={() => isMutating ? null : handleFollowUser(user.id)}
            >

                <RiUserFollowLine
                    size={16}
                    className={followingUsers.includes(user.id) ? 'text-white dark:text-gray-200 dark:group-hover:text-gray-200 group-hover:text-gray-300  ' : 'text-zinc-600 group-hover:text-violet-600'}
                />

            </button>

        </div>

    )
}