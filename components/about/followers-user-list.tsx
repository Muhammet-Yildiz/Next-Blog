import { ISession } from "@/types/session";
import { IAbout } from "@/types/user";
import { useSession } from "next-auth/react";
import { MdMarkEmailRead } from "react-icons/md";
import { CustomUserImage } from "../custom-user-image";

type Props = {
    user: IAbout
    setModalController: React.Dispatch<React.SetStateAction<{
        title: string;
        isOpen: boolean;
    }>>
    handleFollowUser: (userId: string) => void
    isMutating: boolean
}
export const FollowersUserList: React.FC<Props> = ({ user, setModalController, handleFollowUser, isMutating }) => {

    const { data: session } = useSession() as { data: ISession };
    return (
        <div>
            <CustomUserImage src={user?.image} alt="profile" className="w-20 h-20 rounded-full" />

            <h6 className=' line-clamp-2  leading-[16px]   text-zinc-800 text-[13.9px] my-[12px] font-bold font-body dark:text-zinc-300' >
                {user?.username || user?.name}
            </h6>
            <h6 className=' line-clamp-2  leading-[16px]   text-zinc-400 text-[13.5px] mt-[8px] font-semibold  mb-[12px] cursor-pointer hover:text-zinc-500'
                onClick={() => {
                    setModalController({
                        title: 'Followers',
                        isOpen: true
                    })
                }}
            >
                {user?.followersIDs?.length} Followers
            </h6>

            <p className='text-zinc-700 text-[11.5px] max-w-[220px] mt-4 dark:text-zinc-400'>
                {user?.info}
            </p>
            {
                session && user?.email !== session?.email &&
                <div className='flex items-center mt-5 '>


                    <button className={` px-5 py-2 rounded-2xl  text-[12px] font-medium  transition duration-300 ease-in-out border border-solid   
                    ${isMutating ? ' bg-gray-300 text-gray-400  border-gray-300 !cursor-default' :
                            user.followingStatus ? ' text-violet-600  border-violet-600 '
                                : 'bg-violet-600 text-white hover:bg-violet-700 border-violet-600'} `}

                        onClick={() => isMutating ? null : handleFollowUser(user?.id)}
                    >
                        {user.followingStatus ? 'Unfollow' : 'Follow'}
                    </button>

                    <button className='text-white bg-violet-600 rounded-full ml-3 font-medium hover:bg-gray-700 p-[9px] cursor-pointer'
                        onClick={() => window.location.href = `mailto:${user?.email}`} >
                        <MdMarkEmailRead />
                    </button>
                </div>
            }
        </div>
    )
}