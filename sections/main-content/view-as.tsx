"use client"
import React, { Fragment, useEffect, useState } from 'react'
import { AiOutlineUnorderedList } from 'react-icons/ai'
import { MdOutlineGridView } from 'react-icons/md'
import { BiCheck } from 'react-icons/bi'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'

type Props = {
    viewAs: 'grid' | 'list'
    setViewAs: React.Dispatch<React.SetStateAction<'grid' | 'list'>>
}

export const ViewAs: React.FC<Props> = ({ viewAs, setViewAs }) => {

    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setViewAs('list')
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [setViewAs]);
    
    return (

        < div className="relative   z-[2] font-sans  flex  justify-end items-center bsorder-2 borsder-green-700 w-10 col-span-1" >
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <MenuButton >
                        <div className={`flex  justify-center rounded-md px-2 py-2 shadow-md border border-gray-100  dark:border-zinc-700  gap-2 items-center  ${open && 'peer'}    `}

                            onClick={() => setOpen(!open)}
                            onBlur={() => setOpen(false)}
                        >
                            {viewAs === 'grid' ?
                                <MdOutlineGridView
                                    size={17}
                                    className='text-gray-600 dark:text-gray-500'
                                />
                                :
                                < AiOutlineUnorderedList
                                    size={19}
                                    className='text-gray-600 dark:text-gray-500'
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
                    <MenuItems className="absolute  mt-2origin-top-right divide-y divide-gray-100   ring-1 ring-black/5 rounded-md bg-white shadow-xl  top-10 h-auto p-1   w-[130px]  right-0 border border-gray-300  dark:p-0
                       dark:bg-zinc-900 dark:divide-zinc-800/90 dark:border-zinc-700">
                        <div className="px-2 py-[9px]  border-b border-gray-100 bg-slate-50
                       dark:bg-zinc-800 dark:border-zinc-700/90 ">
                            <p className='text-[13.3px] font-bold text-gray-500  line-clamp-1'
                            >
                                View as
                            </p>
                          
                        </div>
                        <div className="px-2 py-1">
                            <MenuItem>
                                <div className='flex items-center py-2 gap-3   cursor-pointer'
                                    onClick={() => setViewAs('grid')}
                                >
                                    < MdOutlineGridView
                                        size={18}
                                        className={`${viewAs === 'grid' && 'text-violet-500'}`}
                                    />
                                    <p className={`text-sm font-medium   ${viewAs === 'grid' ? 'text-violet-500' : 'text-gray-600 dark:text-gray-400'}`} >
                                        Grid
                                    </p>
                                    {
                                        viewAs === 'grid' &&
                                        < BiCheck
                                            className='text-violet-500  ml-3'
                                            size={24}
                                        />
                                    }

                                </div>
                            </MenuItem>

                        </div>
                        <div className="px-2 py-1">
                            <MenuItem>
                                <div className='flex items-center py-2 gap-3  border-b border-gray-100 cursor-pointer dark:border-zinc-800/90'
                                    onClick={() => { setViewAs('list') }}
                                >
                                    < AiOutlineUnorderedList
                                        size={20}
                                        className={`${viewAs === 'list' && 'text-violet-500'}`}
                                    />
                                    <p className={`text-sm font-medium  ${viewAs === 'list' ? 'text-violet-500' : 'text-gray-600 dark:text-gray-400'}`} >
                                        List
                                    </p>
                                    {
                                        viewAs === 'list' &&
                                        < BiCheck
                                            className='text-violet-500  ml-3'
                                            size={24}
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