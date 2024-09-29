import Link from 'next/link'
import { RecommendedTopicsLoadingSkeleton } from '@/components/sidebar-menu/loading-skeletons/recommended-topics-skeleton'
import { SectionTitle } from '@/components/sec-title'
import { useGetTopics } from '@/services/queries'

export default function RecommendedTopics() {

  const { topics, topicsLoading, isError } = useGetTopics('mostUsed')

  if (topicsLoading) return <RecommendedTopicsLoadingSkeleton />

  if (isError) return <>There was a problem fetching the recommended topics request</>

  return (
    <div className='pb-3'>
      <SectionTitle title='Recommended Topics' />

      <div className='flex flex-wrap  w-full mt-4 gap-2'>
        {
          !topicsLoading && topics.slice(0, 6).map((topic, i) => (
            <Link key={i} className="inline"
              href={`?tag=${topic.name}`}
            >

              <div className="inline-block px-3 py-[7px] text-[10px] font-medium bg-gray-200/70 rounded-full dark:bg-zinc-800 dark:text-zinc-400">
                {topic.name}
              </div>
            </Link>
          ))
        }
      </div>

    </div>
  )
}