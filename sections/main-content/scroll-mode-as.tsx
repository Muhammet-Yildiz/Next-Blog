"use client"
import React, { Fragment, useEffect, useState } from 'react'
import { BiCheck } from 'react-icons/bi'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { CgInfinity } from "react-icons/cg";
import { FiLayers } from "react-icons/fi";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
type Props = {
    scrollMode: 'infinite' | 'pagination'
    setScrollMode: React.Dispatch<React.SetStateAction<'infinite' | 'pagination'>>
}

export const ScrollModeAs: React.FC<Props> = ({ scrollMode, setScrollMode }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState<boolean>(false)
    const pathname = usePathname();

    useEffect(() => {
        if (scrollMode === 'infinite') {
            const params = new URLSearchParams(searchParams.toString());

            params.delete('page');

            router.replace(`${pathname}?${params.toString()}`);
        }
    }, [scrollMode, pathname, router, searchParams])


    return (
        <div className="relative   z-[2] font-sans  flex  justify-end items-center bsorder-2 borsder-green-700 w-10 col-span-1" >
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <MenuButton >
                        <div className={`flex  justify-center rounded-md px-2 py-2 shadow-md border border-gray-100 dark:border-zinc-700  gap-2 items-center  ${open && 'peer'} `}
                            onClick={() => setOpen(!open)}
                            onBlur={() => setOpen(false)}
                        >

                            {scrollMode === 'pagination' ?
                                <FiLayers
                                    size={17}
                                    className='text-gray-600  dark:text-gray-500 '
                                />
                                :
                                < CgInfinity
                                    size={19}
                                    className='text-gray-600  dark:text-gray-500'
                                />
                            }

                        </div>

                    </MenuButton>
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
                    <MenuItems className="absolute  mt-2 origin-top-right divide-y divide-gray-100   ring-1 ring-black/5 rounded-md bg-white shadow-xl  top-10 h-auto  w-[160px]  right-0 border border-gray-300 p-1 dark:p-0 dark:bg-zinc-900 dark:divide-zinc-800/90 dark:border-zinc-700">
                        <div className="px-2   border-b border-gray-100 bg-slate-50 dark:bg-zinc-800 dark:border-zinc-700/90 ">
                            <h3 className=' text-[13.6px] font-bold text-gray-500 dark:text-gray-400  font-sans line-clamp-1 py-[10px] ' >
                                Fetch Strategy
                            </h3>
                        </div>
                        <div className="px-2 py-1">
                            <MenuItem>
                                <div className='flex items-center py-2 gap-3  cursor-pointer'
                                    onClick={() => setScrollMode('pagination')} >
                                    <FiLayers
                                        size={18}
                                        className={`${scrollMode === 'pagination' && 'text-violet-500'}`}
                                    />
                                    <p className={`text-[0.82rem] font-medium   ${scrollMode === 'pagination' ? 'text-violet-500 ' : 'text-gray-600 dark:text-gray-400'}`} >
                                        Pagination
                                    </p>
                                    {
                                        scrollMode === 'pagination' &&
                                        < BiCheck
                                            className='text-violet-500  ml-3'
                                            size={23}
                                        />
                                    }

                                </div>
                            </MenuItem>

                        </div>
                        <div className="px-2 py-1">
                            <MenuItem>
                                <div className='flex items-center py-2 gap-3  border-b border-gray-100 cursor-pointer dark:border-zinc-800/90'
                                    onClick={() => setScrollMode('infinite')}
                                >
                                    < CgInfinity
                                        size={19}
                                        className={`${scrollMode === 'infinite' && 'text-violet-500'}`}
                                    />
                                    <p className={`text-[0.82rem] font-medium  ${scrollMode === 'infinite' ? 'text-violet-500' : 'text-gray-600 dark:text-gray-400'}`} >
                                        Infinite Scroll
                                    </p>
                                    {
                                        scrollMode === 'infinite' &&
                                        < BiCheck
                                            className='text-violet-500  ml-[5px]'
                                            size={23}
                                        />
                                    }

                                </div>
                            </MenuItem>
                        </div>

                    </MenuItems>
                </Transition>
            </Menu>
        </div >

    )
}