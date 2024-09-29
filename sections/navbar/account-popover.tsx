"use client"
import Image from 'next/image'
import React, { Fragment, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import { IoLogOutOutline } from 'react-icons/io5'
import { FiUser } from 'react-icons/fi'
import { signOut } from 'next-auth/react'
import { Menu, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { IoBookmarksOutline } from "react-icons/io5";
import { ISession } from '@/types/session'
import { CustomUserImage } from '@/components/custom-user-image'
import { MdSunny } from "react-icons/md";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { useTheme } from 'next-themes'
export const AccountPopover = ({ currentUser }: { currentUser: ISession }) => {

    const [open, setOpen] = useState<boolean>(false)
    const router = useRouter()
    const { theme, setTheme } = useTheme()

    return (
        <>
            <div className=" text-right">
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button >
                            <div
                                className={`flex w-full justify-center rounded-md    gap-2 items-center  ${open && 'peer'} `}
                                onClick={() => setOpen(!open)}
                                onBlur={() => setOpen(false)}
                            >

                                <CustomUserImage src={currentUser?.image} alt="profile" className="rounded-sm mr-1 w-[30px] h-[30px] dark:border dark:border-zinc-900" />

                                <div className='text-left pt-[2px]' typeof='button'>
                                    <p className='text-xs font-medium text-gray-500 dark:text-zinc-500 pb-[3px]'>
                                        {currentUser?.username}
                                    </p>
                                    <p className='text-[10px] font-normal text-zinc-400 dark:text-zinc-600'>
                                        {currentUser?.email}
                                    </p>
                                </div>
                                < HiChevronDown
                                    size={20}
                                    color='gray'
                                />
                            </div>

                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute  mt-2 divide-y divide-gray-100   rounded-md bg-white z-50  top-10 h-auto right-0  border border-gray-200 shadow-lg focus:outline-none   p-2   w-[225px]  
                            dark:bg-black/90 dark:border-zinc-800
                        ">
                            <div className="px-2 py-1">

                                <Menu.Item>
                                    <div className='flex gap-2 items-center border-b border-gray-100 pb-3 dark:border-zinc-800/60'  >

                                        <CustomUserImage src={currentUser?.image} alt="profile" className="rounded-sm mr-1 w-[33px] h-[33px]" />

                                        <div className='text-left pt-[2px] space-y-[4px]'>
                                            <p className='text-xs font-semibold text-gray-500 cursor-pointer  hover:text-gray-600   dark:hover:text-zinc-600  dark:text-zinc-400'
                                                onClick={() => router.push(`/about/@${currentUser?.email.split('@')[0]}`)}
                                            >
                                                {currentUser?.username}
                                            </p>

                                            <p className='text-[12px] font-body text-gray-500 dark:text-zinc-500'  >
                                                {currentUser?.email}
                                            </p>
                                        </div>
                                    </div>
                                </Menu.Item>


                                <Menu.Item>
                                    <div className='flex flex-col gap-2  border-b border-gray-100  dark:border-zinc-800/60 pt-2 pb-3  rounded-md cursor-pointer'  >
                                        <p className='text-[13px] font-body  dark:text-zinc-500 font-semibold pb-1 text-zinc-600' >
                                            Dark Mode
                                        </p>

                                        <div className='flex justify-start gap-5 pr-3 items-center'>

                                            <MdSunny size={20}
                                                onClick={() => setTheme('light')}
                                                className={`  ${theme === 'light' ? 'text-violet-600 bg-violet-600/10 border-slate-300/50 ' : 'text-gray-500 bg-zinc-800/80 border-zinc-800/80 '}
                                                  p-[0.41rem] rounded-sm   w-1/2 h-9 border `}

                                            />
                                            <BsFillMoonStarsFill size={14}
                                                onClick={() => setTheme('dark')}
                                                className={`   ${theme === 'dark' ? 'text-violet-600 bg-violet-700/20 border-violet-700/30' : 'text-gray-500 bg-slate-200/40'}  p-[0.54rem] rounded-sm  bg-slate-200/40 w-1/2 h-9 border-slate-300/50 border `}

                                            />

                                        </div>

                                    </div>
                                </Menu.Item>

                                <Menu.Item >

                                    <div className='flex items-center py-3 gap-3  border-b border-gray-100 cursor-pointer dark:border-zinc-800/60 '
                                        onClick={() => router.push('/account')}
                                    >
                                        <FiUser
                                            size={18}
                                            color='gray'
                                        />
                                        <p className='text-md font-body text-gray-600 dark:text-zinc-500' >
                                            Account
                                        </p>
                                    </div>
                                </Menu.Item>

                                <Menu.Item >

                                    <div className='flex items-center py-3 gap-3  border-b border-gray-100 cursor-pointer dark:border-zinc-800/60'
                                        onClick={() => router.push('/saved-posts')}
                                    >
                                        <IoBookmarksOutline
                                            size={18}
                                            color='gray'
                                        />
                                        <p className='text-md font-body text-gray-600 dark:text-zinc-500' >
                                            Saved Posts
                                        </p>
                                    </div>
                                </Menu.Item>

                                <Menu.Item>

                                    <div className='flex items-center py-3 gap-3  border-b border-gray-100 cursor-pointer dark:border-black '
                                        onClick={async () => {
                                            await signOut()
                                            router.push('/')
                                        }}
                                    >
                                        <IoLogOutOutline
                                            size={20}
                                            color='gray'
                                        />
                                        <p
                                            className='text-md font-body text-gray-600 dark:text-zinc-500'
                                        >
                                            Log out
                                        </p>
                                    </div>

                                </Menu.Item>

                            </div>

                        </Menu.Items>

                    </Transition>
                </Menu>
            </div>

        </>

    )
}