import { CustomUserImage } from "@/components/custom-user-image"
import { useRouter } from "next/navigation"
import { LazyLoadImage } from "react-lazy-load-image-component"
import slugify from "slugify"
import { TiTimes } from "react-icons/ti";
import { useDeleteNotification } from "@/services/mutations";
import toast from "react-hot-toast";
import Link from "next/link";
import { INotification } from "@/types";

type Props = {
    notification: INotification
    isPopover?: boolean
}

export const NotificationItem: React.FC<Props> = ({ notification, isPopover }) => {
    const router = useRouter()
    const { trigger, isMutating } = useDeleteNotification()
    const deleteNotification = async (notificationId: string) => {
        trigger({
            id: notificationId
        },
            {
                onSuccess: () => {
                    router.refresh()
                    toast.success("Notification deleted successfully")
                },
                onError: (error) => {
                    toast.error('Something went wrong')
                }
            }
        )
    }


    return (

        <div className={`${isMutating ? 'opacity-40' : 'opacity-100'}  mb-3 flex items-center gap-4 font-sans text-sm 
        ${isPopover ? 'px-1 py-1' : 'py-4 px-2'} 
       ${notification.isRead ? 'bg-white' : 'bg-violet-100/60'}  shadow-sm relative group hover:bg-violet-50/90 dark:bg-zinc-800/50 dark:hover:bg-zinc-800/60  transition-all duration-200 ease-in-out `}

        >
            {
           notification?.post && notification?.type === 'newPost' || notification?.type === 'applause' ? (
                    <>
                        <CustomUserImage src={notification.actionBy?.image}
                            className="rounded-full w-[36px] h-[36px]" alt='profile'
                        />
                        <div className="flex flex-col gap-1   flex-wrap flex-grow  ">

                            <div className={`flex gap-[6px] font-sans  flex-wrap   ${isPopover ? 'text-[11.4px] gap-y-0  ' : 'text-[13px] '}`}>
                                <p className="font-bold text-zinc-800 cursor-pointer dark:text-zinc-400 "
                                    onClick={() => router.push(`/about/@${(notification?.actionBy.username || notification?.actionBy.name)?.split(' ')[0]?.toLocaleLowerCase()}`)}
                                >
                                    {notification.actionBy.username || notification.actionBy.name}
                                </p>
                                <p className="text-black dark:text-zinc-200">
                                    {notification.type === 'newPost' ?
                                        'posted a new post named' : 'applauded'
                                    }
                                </p>

                                <Link
                                    href={`/post/${slugify(notification?.post?.title, { lower: true, strict: true })}--${notification.post.id}`}
                                    className="text-violet-600 hover:underline font-semibold text-wrap dark:text-violet-400/70 break-words"
                                >
                                    {notification.post.title}
                                </Link>

                            </div>

                            <span className={`  font-sans text-gray-400 font-semibold
                            ${isPopover ? 'text-[9px] ' : 'text-[10.6px]'}   `}

                            >
                                {`${new Date(notification.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })} 
                           ${new Date(notification.createdAt).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}`}
                            </span>
                        </div>
                        <div className={` w-4 h-4  ${notification.isRead ? 'hidden' : 'block'} `} >

                            <span className="w-2 h-2 bg-violet-600/80 shadow-xl    rounded-full block" />
                        </div>

                        <LazyLoadImage
                            src={notification?.post?.image || '/post.png'}
                            alt='image'
                            className='  h-[46px] min-w-[62px] max-w-[62px]   flex-grow-0  '
                            placeholderSrc={notification?.post?.image || '/post.png'}
                            wrapperClassName='rounded-sm   cursor-pointer'
                            loading='lazy'
                            effect='blur'
                            key={notification?.post.id}
                            wrapperProps={{
                                style: {
                                    transitionDelay: "250ms",
                                    transitionDuration: "300ms",
                                    transitionTimingFunction: "ease-in",
                                },
                            }}
                            onClick={() => {
                                router.push(`/post/${slugify(notification?.post?.title, { lower: true, strict: true })}--${notification.post.id}`)
                            }}
                        />
                        <TiTimes
                            className="cursor-pointer absolute hidden group-hover:flex right-[5px] shadow-sm bg-slate-400 top-[4px] text-white z-[2] dark:bg-zinc-600" size={15}
                            onClick={() =>
                                isMutating ? null : deleteNotification(notification.id)}
                        />
                    </>

                ) :

                    notification.type === 'follow' && (
                        <>
                            <CustomUserImage src={notification?.actionBy?.image}
                                className="rounded-full w-[36px] h-[36px]" alt='profile'
                            />
                            <div className="flex flex-col gap-1   flex-wrap flex-grow ">

                                <div className={`${isPopover ? 'text-[11.4px] gap-y-0  ' : 'text-[14px] '} flex gap-[6px] font-sans  flex-wrap`} >

                                    <p className="font-bold text-zinc-800 cursor-pointer   dark:text-zinc-400"
                                        onClick={() => router.push(`/about/@${(notification?.actionBy.username || notification?.actionBy.name)?.split(' ')[0]?.toLocaleLowerCase()}`)}
                                    >
                                        {notification?.actionBy.username || notification.actionBy.name}
                                    </p>
                                    <p className="text-black dark:text-zinc-200">
                                        is started following
                                    </p>

                                    {
                                        notification?.content.split('||')[2].trim() === 'you' ? 'you' :
                                            <Link
                                                href={`/about/@${notification?.content?.split('||')[2]?.trim()?.split(' ')[0]?.toLocaleLowerCase()}`}
                                                className="text-violet-600 hover:underline font-semibold text-wrap  dark:text-violet-400/70"
                                            >
                                                {notification?.content.split('||')[2]}
                                            </Link>
                                    }

                                </div>

                                <span className={`  font-sans text-gray-400 font-semibold
                                    ${isPopover ? 'text-[9px] ' : 'text-[10.6px]'}`} >
                                    {`${new Date(notification.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })} 
                                     ${new Date(notification.createdAt).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}`}
                                </span>
                            </div>

                            <div className={` w-4 h-4     ${notification.isRead ? 'hidden' : 'block'} `} >
                                <span className="w-2 h-2 bg-violet-600/80 shadow-xl    rounded-full block" />
                            </div>
                            <TiTimes
                                className="cursor-pointer absolute hidden group-hover:flex right-[5px] shadow-sm bg-slate-400  top-[4px] text-white z-[2] dark:bg-zinc-600" size={15}   onClick={() =>  isMutating ? null : deleteNotification(notification.id)}
                            />
                            <div className='h-[46px] min-w-[62px]  flex-grow-0' />
                        </>

                    )
            }
        </div>
    )

}