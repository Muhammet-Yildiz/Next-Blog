import { ISession } from "@/types/session";
import { IAbout } from "@/types/user"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { HiDotsHorizontal } from "react-icons/hi";
import { CustomUserImage } from "../custom-user-image";

type Props = {
    user: IAbout
    setModalController: React.Dispatch<React.SetStateAction<{
        title: string;
        isOpen: boolean;
    }>>
}

export const FollowingUserList: React.FC<Props> = ({ user, setModalController }) => {
    const { data: session } = useSession() as { data: ISession };
    const router = useRouter()
    return (
        <div className='mt-7'>
            <h6 className='text-zinc-800 text-[12.9px]  font-bold mb-[17px] font-body dark:text-zinc-400 '>
                Following
            </h6>

            <div className='flex flex-col  '>

                {
                    user?.following?.slice(0, 5).map((item, index: number) => (

                        <div key={index} className='flex items-center space-x-3 mb-[16px]  w-[220px] relative' >

                             <CustomUserImage src={item?.image} alt="profile" className="rounded-full w-[16px] h-[16px]" />       

                            <p className='text-zinc-500 text-[10.1px] font-semibold font-body pl-1 cursor-pointer hover:text-zinc-600 dark:text-zinc-500 '
                                onClick={() => router.push(`/about/@${item?.email.split('@')[0]}`)} >

                                {item.username || item.name}
                            </p>
                            <HiDotsHorizontal
                                className='  absolute right-0 text-zinc-500 font-semibold cursor-pointer hover:text-zinc-600'
                            />
                        </div>

                    ))
                }

            </div>
            {
                user?.following?.length === 0 ? <p className='text-zinc-500 text-[10.1px] font-semibold font-body bg-slate-100 p-2 dark:bg-zinc-900/80'>
                    {
                        user?.email === session?.email ? 'You have no users to follow' : 'This user has no users to follow'
                    }
                </p> :

                    <p className='text-[10px] text-zinc-600  pb-2 mt-1 font-semibold cursor-pointer hover:text-zinc-700 dark:text-violet-600/80'
                        onClick={() => {
                            setModalController({
                                title: 'Following',
                                isOpen: true
                            })
                        }}
                    >
                        See all ({user?.followingIDs?.length})
                    </p>}

        </div>
    )
}