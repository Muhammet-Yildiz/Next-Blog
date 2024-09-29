"use client"
import React, { Fragment, useEffect, useState } from 'react'
import { BiCheck } from 'react-icons/bi'
import { Menu, MenuItem, Transition } from '@headlessui/react'
import { SortType } from '@/types'
import { TbArrowsSort } from "react-icons/tb";
import { useRouter, useSearchParams } from 'next/navigation'
type Props = {
    sortType: SortType,
    setSortType: React.Dispatch<React.SetStateAction<SortType>>
    setPageIndex: React.Dispatch<React.SetStateAction<string>>
    scrollMode: 'infinite' | 'pagination'
}

const sortOptions = [
    { name: 'Recommended', value: 'RECOMMENDED' },
    { name: 'Most Recent', value: 'MOST_RECENT' },
    { name: 'Least Recent', value: 'LEAST_RECENT' },
    { name: 'Most Liked', value: 'MOST_LIKED' },
    { name: 'Least Liked', value: 'LEAST_LIKED' },
    { name: 'Most Viewed', value: 'MOST_VIEWED' },
    { name: 'Least Viewed', value: 'LEAST_VIEWED' },
    { name: 'Most Commented', value: 'MOST_COMMENTED' },
]

export const SortSelectorAs: React.FC<Props> = ({ sortType, setSortType ,setPageIndex ,scrollMode}) => {
    const currentTag = useSearchParams().get('tag');
    const router = useRouter()
    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
      
        scrollMode === 'pagination' &&  setPageIndex('1')
    
    }, [sortType , scrollMode, setPageIndex])

    return (

        < div className="relative   z-[2] font-sans  flex  justify-end items-center  w-10 col-span-1" >
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button >
                        <div  className={`flex  justify-center rounded-md px-2 py-2 shadow-md border border-gray-100  dark:border-zinc-700  gap-2 items-center  ${open && 'peer'}     `}

                            onClick={() => setOpen(!open)}
                            onBlur={() => setOpen(false)}
                        >

                            <div className="relative">
                                <TbArrowsSort size={18} className="text-gray-600 dark:text-gray-500 " />
                                <TbArrowsSort
                                    size={18}
                                    className= {`text-violet-500 dark:text-violet-500 ${sortType.startsWith('MOST') || sortType.startsWith('RECOM') ?  'clip-half-left' : 'clip-half-right'}  `}
                                    
                                />
                            </div>
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
                    <Menu.Items className="absolute  mt-2 origin-top-right divide-y divide-gray-100   ring-1 ring-black/5 rounded-md bg-white shadow-xl  top-10 h-auto p-1   w-[145px]  right-0 border border-gray-300 dark:p-0
                       dark:bg-zinc-900 dark:divide-zinc-800/90 dark:border-zinc-700 ">
                        <div className="px-2 py-[9px] border-b border-gray-100 bg-slate-50 dark:bg-zinc-800 dark:border-zinc-700/90 ">
                            <p className='text-[13.3px] font-bold text-gray-500 line-clamp-1'>
                                Sort by
                            </p>
                        </div>

                        {
                            sortOptions.map((option) => (

                                <MenuItem key={option.value} >
                                    <div className='flex items-center py-3 gap-2  border-b border-gray-100 cursor-pointer  px-2'
                                        onClick={() => {
                                            setSortType(option.value as SortType)
                                        
                                            router.replace( scrollMode === 'infinite' ? `/?${currentTag ? `tag=${currentTag}&` : ''}sort=${option.value}`  : `/?page=1&${currentTag ? `tag=${currentTag}&` : ''}sort=${option.value}`)
                                        }}
                                    >
                                        <p className={`text-[13px] font-medium  ${option.value === sortType ? 'text-violet-500' : 'text-gray-600 dark:text-gray-400'}`}
                                        >
                                            {option.name}
                                        </p>
                                        {
                                            option.value === sortType &&
                                            < BiCheck
                                                className='text-violet-500  '
                                                size={24}
                                            />
                                        }
                                    </div>
                                </MenuItem>
                            ))
                        }

                    </Menu.Items>
                </Transition>
            </Menu>
        </div >

    )
}