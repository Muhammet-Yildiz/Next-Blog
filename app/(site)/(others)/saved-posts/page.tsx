"use client"
import { MdBookmarkAdded } from "react-icons/md";
import { TbDots } from "react-icons/tb";
import { useGetSavedPosts } from '@/services/queries';
import { SavedPostPageSpinner } from '@/components/saved-posts/loading/saved-post-page-spinner';
import { ISession } from "@/types/session";
import { useSession } from "next-auth/react";
import { SavedPostItem } from "@/components/saved-posts/saved-post-item";
import { useRouter } from "next/navigation";
import { CustomUserImage } from "@/components/custom-user-image";

export default function SavedPostsPage() {

  const router = useRouter()
  const { data: session } = useSession() as { data: ISession };

  const { posts, postsLoading, isError } = useGetSavedPosts()

  if (postsLoading && !session) return <SavedPostPageSpinner />

  if (isError) return <>There was a problem fetching the saved posts request</>



  return (
    <div className="container mx-auto  max-w-2xl px-4 py-6  font-sans" >
      <p className='text-zinc-600 text-[19px] font-bold  pb-[17px] bg-slate-100  p-3  mb-2 dark:bg-zinc-900 dark:text-zinc-500'>
        Saved Posts
      </p>
      <div
        className="flex items-center justify-between  mb-3 py-2 border-b border-t  border-gray-100  dark:border-zinc-800/70 ">
        <div className="flex items-center  space-x-4">

          <CustomUserImage src={session?.image}
            className="rounded-full w-[40px] h-[40px]" alt='profile'
          />

          <div>
            <h6 className="text-[13px] font-semibold dark:text-zinc-400 cursor-pointer "
              onClick={() => router.push(`/about/@${session?.email.split('@')[0]}`)} >
              {session?.username || session?.name}
            </h6>

            <div className="flex items-center space-x-1" >
              <p className="text-[11px] text-gray-500 mt-1" >
                {
                  new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                }
              </p>
              <p className="text-[11px] text-gray-500 px-1">
                -
              </p>
              < MdBookmarkAdded className="text-[13.6px] text-violet-400 cursor-pointer mt-1" />
              <p className="text-[11px] text-gray-500 mt-1" >
                {posts?.length} post
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center"  >
          <TbDots className="text-gray-600 cursor-pointer text-[21px]" />
        </div>

      </div>

      <div className="mt-4">
        {posts.length > 0 ? posts?.map((post, index) => (
          <SavedPostItem key={index} post={post} />
        )) :
          <p className='text-gray-400 text-[13px]  text-center py-28 bg-slate-100 dark:bg-zinc-500/15 font-semibold ' > Start saving posts to see them here.</p>
        }

      </div>

    </div>
  )
}
