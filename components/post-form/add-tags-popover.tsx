import { useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { FaTags } from "react-icons/fa6";
import { useGetTopics } from '@/services/queries';
import { ITopic } from '@/types';
import { IoMdAdd } from "react-icons/io";

type Props = {
    selectedTags: ITopic[],
    setSelectedTags: (tags: ITopic[]) => void
    newTags: string[]
    setNewTags: (tags: string[]) => void
}

export function AddTagsPopover({ selectedTags, setSelectedTags, newTags, setNewTags }: Props) {

    const { topics } = useGetTopics('all')
    const [searchText, setSearchText] = useState<string>('')

    const filteredTopics = topics?.filter((topic) => {
        return topic.name.toLowerCase().includes(searchText.toLowerCase())
    })


    return (
        <Popover className="absolute right-0 top-0">
            {({ open }) => (
                <>
                    <Popover.Button
                        className={`${open ? 'text-white' : 'text-black/90'} bg-gray-200 dark:bg-zinc-800/80 p-[7px] rounded-lg group inline-flex items-center    text-base font-medium  focus:outline-none `}   >
                        <FaTags className='text-gray-600 dark:text-zinc-500' />
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
                        <Popover.Panel className="absolute right-0 z-10 mt-3 w-64  -translate-x-0 transform px-1 bg-white dark:bg-zinc-800 ">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                                <div className=" p-3  bg-gray-100 dark:bg-zinc-800/50">
                                    <span className=" text-[12px] font-bold text-gray-900 text-center  dark:text-zinc-400">
                                        Add Tags
                                    </span>
                                </div>
                                <input className="w-full  py-3 outline-none   text-[12px]  mb-1 bg-white pl-2  shadow-lg ring-1 ring-black/5 dark:bg-zinc-700/40" type="text" placeholder="Search..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />

                                <div className="relative grid gap-1 bg-white pl-1 pt-1 grid-cols-1 max-h-72 overflow-y-auto  overflow-x-hidden  shadow-lg ring-1 ring-black/5  dark:bg-zinc-700/40 ">
                                    {filteredTopics.
                                        map((topic, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center p-2 transition duration-150 ease-in-out rounded-sm hover:bg-gray-100 cursor-pointer
                                                     pl-2 dark:hover:bg-zinc-800
                                            
                                                     ${selectedTags?.find((t) => t.id === topic.id) ? 'bg-violet-100 dark:bg-violet-500/10' : ''}`}
                                                    onClick={() => {
                                                    if (selectedTags?.find((t) => t.id === topic.id)) {
                                                        setSelectedTags(selectedTags.filter((t) => t.id !== topic.id))
                                                    } else {
                                                        setSelectedTags([...selectedTags, topic])
                                                    }
                                                    setSearchText('')
                                                }}
                                            >
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-medium text-gray-700 dark:text-zinc-300 ">{topic.name}</p>
                                                </div>

                                            </div>
                                        ))}
                                    {filteredTopics.length === 0 &&

                                        <div className={` p-2 `} >
                                            <p className="text-sm font-medium text-gray-700 dark:text-zinc-300" >
                                                {searchText}
                                            </p>
                                            <button
                                                className='flex items-center gap-1 p-1 px-[0.4rem] cursor-pointer hover:bg-green-500 
                                                absolute bottom-[0.45rem] right-2 bg-green-400 rounded-sm transition duration-300 ease-in-out'
                                                onClick={() => {
                                                    if (newTags.includes(searchText)) {
                                                        setNewTags(newTags.filter((t) => t !== searchText))
                                                    } else {
                                                        setNewTags([...newTags, searchText])
                                                    }
                                                    setSearchText('')
                                                }}
                                            >
                                                {newTags?.includes(searchText) ?
                                                    <IoMdAdd className='text-white rotate-45'
                                                        onClick={() => setNewTags(newTags.filter((t) => t !== searchText))}
                                                    />
                                                    :
                                                    <>
                                                        <IoMdAdd className='text-white' />
                                                        <p className='text-[11px] text-white font-semibold' >Add</p>
                                                    </>
                                                }
                                            </button>


                                        </div>


                                    }
                                </div>

                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}