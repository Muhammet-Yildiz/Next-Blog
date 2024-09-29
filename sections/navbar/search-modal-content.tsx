import { useSearchQuery } from "@/services/queries";
import { useState } from "react";
import { useDebounce } from 'use-debounce';
import { FiSearch } from 'react-icons/fi'
import { InitialSearchDisplay } from "@/components/search-modal-content/initial-search-display";
import { SearchRelatedTopics } from "@/components/search-modal-content/search-related-topics";
import { SearchRelatedUsers } from "@/components/search-modal-content/search-related-users";
import { SearchRelatedPosts } from "@/components/search-modal-content/search-related-posts";
import Image from "next/image";
export const SearchModalContent = ({ handleClose }: { handleClose: () => void }) => {

    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebounce(query, 500);

    const { posts, users, topics, isLoading, isError } = useSearchQuery(debouncedQuery);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);

    return (
        <div className=" min-h-[560px]  px-12 pt-7 bg-gray-100/50 dark:bg-zinc-950 dark:text-neutral-200  border dark:border-zinc-800/70" >
            <div className="relative mb-5">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    className={` h-10 pl-10 flex items-center w-full  space-x-3 font-sans text-left ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500 shadow-sm  text-slate-600 rounded-md  text-[13px] font-semibold bg-transparent focus:bg-white peer dark:bg-zinc-900 dark:text-slate-300 dark:ring-1 dark:ring-slate-900/5 dark:focus:bg-zinc-900`}
                    autoComplete="off"
                    placeholder="Search anything"
                />
                <FiSearch className='absolute left-3 top-3 text-slate-300 dark:text-slate-400 peer-focus:text-violet-500 ' size={17} />

            </div>
            {isError && <div>Error occurred.</div>}

            {!query ? <InitialSearchDisplay handleClose={handleClose} /> :

                <div className={` gap-y-2 flex flex-col relative   ${isLoading || query !== debouncedQuery ? 'opacity-50' : 'opacity-100'} `}  >

                    <Image src="/spinner.svg" alt="spinner"
                        className={`   absolute top-40 left-1/2 w-16 ${isLoading || query !== debouncedQuery ? 'opacity-50' : 'opacity-0'} `}
                        width={64}
                        height={64}
                    />

                    <SearchRelatedTopics
                        topics={topics}
                        query={query}
                        handleClose={handleClose}
                    />

                    <SearchRelatedUsers
                        users={users}
                        query={query}
                        handleClose={handleClose}
                    />
                    <SearchRelatedPosts
                        posts={posts}
                        query={query}
                        handleClose={handleClose}
                    />

                </div>

            }

        </div>
    )
}