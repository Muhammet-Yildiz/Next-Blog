import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { MdNotificationsActive } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useGetNotifications } from '@/services/queries';
import { NotificationItem } from '../notifications/notification-item';

export const NotificationsPopover = () => {

    const router = useRouter()
    const { unReadNotifications } = useGetNotifications()

    return (
        <Popover className="relative hidden sm:flex">
            {({ open, close }) => (
                <>
                    <Popover.Button
                        className={` bg-slate-200/50 dark:bg-zinc-900  rounded-lg group inline-flex items-center    text-base font-medium  focus:outline-none hover:bg-slate-200/60  dark:text-gray-500/80 dark:bg-violet-100/10 px-[0.7rem] py-[0.61rem] mt-[2px] relative`}
                    >
                        <MdNotificationsActive className='text-[20px]  text-zinc-800/60 
                            dark:text-gray-500'
                        />
                        {!!unReadNotifications?.length &&
                            <span
                                className='absolute top-[-1px] right-[-2px] bg-violet-400 text-white  
                              text-[10px]  w-5 h-5 rounded-full flex items-center justify-center
                              dark:bg-violet-600/45 shadow-lg z-[3] shadow-violet-500/50 dark:shadow-violet-600/45 '
                            >
                                {unReadNotifications?.length}
                            </span>
                        }
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute left-1/2 z-10 mt-3  max-w-lg -translate-x-1/2 transform px-4 sm:px-0 top-10 bg-white border border-gray-200    dark:bg-black/90 dark:border-zinc-800 shadow-lg focus:outline-none  w-[450px]  " >
                            <div className="px-2 py-1">
                                <div className="bg-gray-100/60 p-4 py-3 font-bold text-base flex items-center mb-1 dark:bg-zinc-800/60 dark:text-gray-500">
                                    Notifications

                                    <div className="flex-grow" />
                                    {!!unReadNotifications?.length &&
                                        <span className="bg-violet-400 text-white  px-[6px] py-[3px]  text-[10px] rounded-md mt-[2px]  dark:bg-violet-400/70">
                                            {unReadNotifications?.length} New
                                        </span>
                                    }

                                </div>
                                <div
                                    className=' max-h-[340px] overflow-y-auto mb-1'
                                >
                                    {
                                        unReadNotifications.map((notification, index) => (
                                            <NotificationItem key={index} notification={notification} isPopover />
                                        ))
                                    }
                                    {
                                        unReadNotifications?.length === 0 && <p className='text-center text-gray-400 text-[12.3px] border border-gray-400/10 font-semibold py-7 dark:border-zinc-800/80 bg-gray-300/10 mb-1 '>No new notifications</p>
                                    }

                                </div>

                                <button
                                    onClick={() => { router.push('/notifications'); close() }}
                                    className='text-xs font-semibold bg-violet-500 text-white hover:bg-violet-600/90 cursor-pointer w-full text-center py-2 rounded-sm mb-1'

                                >
                                    See all notifications
                                </button>

                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}