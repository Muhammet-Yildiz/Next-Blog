import { useGetPostsInfinite } from "@/services/queries";
import { useEffect } from "react";
import { CardItem } from "@/components/main-content/card-item";
import { CardListLoadingSkeleton } from "@/components/main-content/loading-skeletons/card-list-skeleton";
import { useSearchParams } from "next/navigation";
import { SortType } from "@/types";
import { GridCardListLoadingSkeleton } from "@/components/main-content/loading-skeletons/grid-card-list-skeleton";
import Image from "next/image";

type Props = {
    viewAs: 'grid' | 'list',
    sortType: SortType
}

export const InfiniteCardList: React.FC<Props> = ({ viewAs ,sortType}) => {
    const tag = useSearchParams().get('tag')

    const { posts, isLoadingMore, size, setSize, isReachingEnd, isLoadingInitialData, isError } = useGetPostsInfinite( tag || '' ,sortType);

    const loadMore = () => setSize(size + 1);

    useEffect(() => {
        const onScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 && !isLoadingMore && !isReachingEnd) {
                loadMore();
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [isLoadingMore, isReachingEnd]);


    if (isError) return <>There was a problem fetching the posts request</>

    return (

        <>
         <div className={`flex  font-sans  relative bordser-2 borsder-red-500 ${viewAs === 'grid' ? 'flex-row flex-wrap   justify-between ' : 'flex-col'} `}  >

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
          
             {isLoadingInitialData ? viewAs === 'grid' ? <GridCardListLoadingSkeleton /> : <CardListLoadingSkeleton />
                : 
                isLoadingMore && 
                <div className='flex justify-center items-center h-[10px] mt-[-10px'>
                   
                     <Image src="/spinner.svg" alt="spinner" 
                        className='w-[5.3rem] h-[5.3rem] '
                        width={84.8}
                        height={84.8}
                    />
                </div>
            }
            {isReachingEnd && <p
                className='text-gray-500 text-[0.8rem] text-center pb-3'
            >No more posts</p>}
        </>

    )

}