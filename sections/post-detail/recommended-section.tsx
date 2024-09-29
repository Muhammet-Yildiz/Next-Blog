import { AboutPageSpinner as Spinner } from "@/components/about/loading/about-page-spinner";
import { CustomUserImage } from "@/components/custom-user-image"
import { FollowButton } from "@/components/follow-button";
import { CardItem } from "@/components/main-content/card-item";
import { radioCanada } from "@/lib/fonts";
import { useGetRecommendations } from "@/services/queries"
import { IPost } from "@/types/post";
import { ISession } from "@/types/session"
import { useSession } from "next-auth/react"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdMarkEmailRead } from "react-icons/md";

export const RecommendedSection = ({ post }: { post: IPost }) => {
    const { data: session } = useSession() as { data: ISession }
    const router = useRouter()
    const { author, authorPosts, relatedPosts, isLoading } = useGetRecommendations(post?.id)


    if (isLoading) return <Spinner />

    return (
        <>
            <div className="mt-20 border-b border-gray-200 pb-10 dark:border-zinc-800/80">

                <CustomUserImage src={author?.image} alt="profile" className="w-20 h-20 rounded-full"
                />
                <div className="flex justify-between  items-center mt-5">
                    <h6 className={`${radioCanada.className}  text-zinc-800 text-[22.9px] self-end font-bold  dark:text-neutral-300 `}>
                        Written by  {author?.username || author?.name}
                    </h6>
                    {
                        session && author?.email !== session?.email &&
                        <div className='flex items-center  '>
                            <FollowButton post={post}
                                styleVariant='largeBtn'
                            />

                            <button
                                className='text-white bg-violet-600 rounded-full ml-3 font-medium hover:bg-gray-700 p-[9px] cursor-pointer'
                                onClick={() => window.location.href = `mailto:${author?.email}`}

                            >
                                <MdMarkEmailRead />
                            </button>
                        </div >
                    }
                </div>

                <h6 className=' line-clamp-2  leading-[16px]   text-zinc-700 text-[13.5px] mt-[8px] font-semibold  mb-[12px] cursor-pointer hover:text-zinc-800 dark:text-neutral-400 '
                    onClick={() => router.push(`/about/@${author?.email.split('@')[0]}`)}
                >
                    {author?.followersIDs?.length} Followers
                </h6>

                <p className='text-zinc-800 text-[12px] max-w-[470px] mt-5 dark:text-neutral-400'>
                    {author?.info || 'No bio available'}
                </p>

            </div>


            {!!authorPosts.length && <div className={`flex  font-sans  relative  flex-col mt-6 `}  >
                <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mt-5 mb-8" >More from {author?.username || author?.name} 🌈💜🥘🎭</h2>
                {
                    authorPosts?.map((post) => (
                        <CardItem
                            key={post.id}
                            viewAs={'list'}
                            post={post}
                            variant="recommended"
                        />
                    ))
                }

            </div>}

            {!!relatedPosts.length && <div className={`flex  font-sans  relative  flex-col mt-10 `}  >
                <h2 className="text-[18px] font-semibold text-gray-800 dark:text-gray-100 mt-5 mb-12" >Recommended from Next Blog 📜👌🎍😍</h2>
                <div className={`flex  font-sans  relative  flex-row flex-wrap `}  >
                    {
                        relatedPosts?.map((post) => (
                            <CardItem
                                key={post.id}
                                viewAs={'grid'}
                                post={post}
                            />
                        ))
                    }
                </div>
            </div>}

            <div className='text-gray-500 dark:text-gray-400 text-[10px] pb-2 pt-4 border-t border-slate-200 text-center dark:border-zinc-800/80'>
                Crafted with a little help from the
                <Image src="/ghost.gif" alt="ghost"
                    className='w-6 h-6 inline mx-1 mb-[0.2rem]'
                    width={24}
                    height={24}
                    unoptimized
                />
                by
                <Link
                    href='https://github.com/Muhammet-Yildiz'
                    className='text-violet-600 font-medium ml-1 dark:text-violet-700/80'
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Muhammet Yıldız
                </Link>
            </div>

        </>
    )

}