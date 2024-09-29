'use client';
import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import { darumadrop } from '@/lib/fonts';
import { AuthLinks } from '../auth-links';
import { NotificationsPopover } from '../notifications-popover';
import { AccountPopover } from '../account-popover';
import { ISession } from '@/types/session';
import { SearchModalContent } from '../search-modal-content';
import { FiSearch } from 'react-icons/fi'
import { ActionModal } from '@/components/action-modal';

export default function Navbar() {

    const { data: session } = useSession() as { data: ISession }
    const [searchModalVisible, setSearchModalVisible] = useState<boolean>(false)

    return (
        <header className={`dark:bg-opacity-40 border-gray-200 dark:border-b-0 z-30 min-w-full flex flex-col relative  dark:bg-grey-900`}>
            <nav className=' 2xl:w-full w-full  2xl:px-0 mx-auto py-4  flex items-center justify-between  space-x-4   bordser-2 borsder-blue-800 '>

                <Link href={'/'} className={`${darumadrop.className} transition-colors duration-300 font-bold md:text-[28px] text-slate-700 dark:text-slate-300   sm:text-[24px] text-[20px] flex`}  >
                    NEXT  BLOG
                </Link>


                <div className='w-9/12  flex items-center lg:justify-between justify-end ' >
                    <div className="relative grow   max-w-[420px]  mr-4 lg:flex hidden  rounded-md cursor-pointer group   dark:bg-zinc-900 dark:text-slate-300 dark:ring-1 dark:ring-slate-900/5 shadow-sm" onClick={() => setSearchModalVisible(true)}  >
                        <div className={` h-10 pl-10 flex items-center w-full  space-x-3  text-left ring-1 ring-slate-900/5   shadow-sm   rounded-md   bg-transparent `} />
                        <p className={`absolute left-10 top-[0.62rem] text-gray-400 dark:text-slate-400 font-sans font-medium text-[13px]`} >
                            Search  anything
                        </p>
                        <FiSearch className='absolute left-3 top-3 text-slate-300 dark:text-slate-400 ' size={17} />
                    </div>
                    {
                        searchModalVisible &&

                        <ActionModal isOpen={searchModalVisible}
                            handleClose={() => setSearchModalVisible(false)}
                            content={<SearchModalContent
                                handleClose={() => setSearchModalVisible(false)}
                            />}
                        />

                    }

                    <ul className='flex items-center gap-8 font-sans  text-[15px] text-gray-700  flex-none  borsder-2 borsder-blue-500 '>

                        <AuthLinks />

                        {session &&
                            <>
                                <NotificationsPopover />

                                <AccountPopover currentUser={session} />
                            </>
                        }
                    </ul>

                </div>

            </nav>

        </header>
    )
}