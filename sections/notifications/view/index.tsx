"use client"
import { useGetNotifications } from "@/services/queries";
import { NotificationItem } from "../notification-item";
import { AboutPageSpinner as Spinner } from "@/components/about/loading/about-page-spinner";
import { useMarkNotificationsAsRead } from "@/services/mutations";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Notifications() {
    const { trigger } = useMarkNotificationsAsRead()
    const { allNotifications, notificationsLoading, isError, unReadNotifications } = useGetNotifications()
    const router = useRouter()
    if (notificationsLoading) return <Spinner />

    if (isError) return <>There was a problem fetching the notifications request</>

    const handleMarkAllAsRead = () => {
        trigger().then(() => {
            router.refresh()
            toast.success("All notifications marked as read")
        }).catch((error) => {
            toast.error("Something went wrong")
            console.log(error)
        })
    }


    return (
        <div className="container mx-auto  max-w-2xl px-4 py-6  font-sans" >
            <div className='text-zinc-700 text-[19px] font-bold  pb-[17px] bg-gray-200/60  p-3  mb-4 dark:bg-zinc-900 dark:text-zinc-300/90 flex items-center gap-4'>
                Notifications
                <span className="bg-zinc-500/80 text-white px-2 py-1 text-xs rounded-sm mt-[2px]  dark:bg-violet-400/70">
                    {allNotifications?.length}
                </span>
                <div className="flex-grow" />
                {
                    !!unReadNotifications?.length &&
                    <>
                        <span className="bg-violet-400 text-white px-2 py-1 text-[11px] rounded-md mt-[2px]  dark:bg-violet-400/70">
                            {unReadNotifications?.length} New
                        </span>
                        <p className="text-[13px] text-gray-500 ml-2  hover:text-gray-600 cursor-pointer border border-zinc-400/80  p-1 px-2 rounded-md dark:text-gray-400/80 dark:hover:text-gray-300/80 font-medium"
                            onClick={handleMarkAllAsRead}
                        >
                            Mark all as read
                        </p>
                    </>

                }

            </div>

            <div>
                {
                    allNotifications?.map((notification, index) => (
                        <NotificationItem key={index} notification={notification} />
                    ))
                }
                {
                    !allNotifications?.length && <p className='text-center text-gray-400 text-[12.3px] border border-gray-400/10 font-semibold py-10 dark:border-zinc-800/80 bg-gray-300/10 mb-1 '>No notifications</p>
                }

            </div>

        </div>
    )

}