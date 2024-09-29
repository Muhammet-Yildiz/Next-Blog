"use client"
import { CardItem } from '@/components/main-content/card-item'
import { CardListLoadingSkeleton } from '@/components/main-content/loading-skeletons/card-list-skeleton'
import { useSearchParams } from 'next/navigation'
import { useGetPosts } from '@/services/queries'
import { SortType } from '@/types'
import { PaginationButtons } from './pagination-buttons'
import { GridCardListLoadingSkeleton } from '@/components/main-content/loading-skeletons/grid-card-list-skeleton'

type Props = {
    viewAs: 'grid' | 'list',
    sortType: SortType,
    pageIndex: string,
    setPageIndex: React.Dispatch<React.SetStateAction<string>>
}

export const CardList: React.FC<Props> = ({ viewAs, sortType, pageIndex, setPageIndex }) => {
    const tag = useSearchParams().get('tag')
    const { posts, totalPages, postsLoading, isError } = useGetPosts(pageIndex, tag || '', sortType);

    if (postsLoading) return viewAs === 'grid' ? <GridCardListLoadingSkeleton /> : <CardListLoadingSkeleton />

    if (isError) return <>There was a problem fetching the posts request</>

    return (

        posts.length === 0 ?
            <div className='flex justify-center items-center h-[200px]'>
                <p className='text-gray-500 text-sm'>No posts found</p>
            </div>
            :
            <>
                <div className={`flex font-sans relative bordser-2 borsder-red-500 ${viewAs === 'grid' ? 'flex-row flex-wrap   justify-between ' : 'flex-col'} `}  >

                    {
                        posts?.map((post) => (
                            <CardItem
                                key={post.id}
                                viewAs={viewAs}
                                post={post}
                            />
                        ))
                    }

                </div>

                <PaginationButtons
                    totalPages={totalPages}
                    currentPage={pageIndex}
                    setPageIndex={setPageIndex}
                    sortType={sortType}
                />

            </>
    )
}