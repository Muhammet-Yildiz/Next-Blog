
import { PopularPostItem } from '@/components/sidebar-menu/popular-post-item';
import { SectionTitle } from '@/components/sec-title';
import { PopularPostsLoadingSkeleton } from '@/components/sidebar-menu/loading-skeletons/popular-posts-skeleton';
import { useGetPopularPosts } from '@/services/queries';

export const PopularPosts = () => {

    const {posts , postsLoading ,isError} = useGetPopularPosts()

    if (postsLoading)   return <PopularPostsLoadingSkeleton />

    if (isError) return <>There was a problem fetching the popular posts request</>

    return (
        posts.length > 0 && !postsLoading && <div>
            <span className='text-[11px] text-slate-500 font-semibold '>
                {`What's Hot`}
            </span>
            <SectionTitle title='Most Popular' />

            {posts?.map((post) => (
                <PopularPostItem
                    key={post.id}
                    post={post}
                />
            ))}
        </div>
    )
}