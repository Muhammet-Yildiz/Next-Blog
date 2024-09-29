"use client"

import { useGetUserAbout } from '@/services/queries';
import { AboutPageSpinner } from '@/components/about/loading/about-page-spinner';
import { AboutPostItem } from '@/components/about/about-post-item';
import { UserProfileSidebar } from '@/components/about/user-profile-sidebar';
import { CustomConfetti } from '@/components/about/custom-confetti';
import { ISession } from '@/types/session';
import { useSession } from 'next-auth/react';

export default function AboutPage({ params }: { params: { email: string } }) {
    const { data: session } = useSession() as { data: ISession }
    const subEmail = params.email.replace('%40', '')
    const { user, userLoading, isError } = useGetUserAbout(subEmail)

    if (userLoading) return <AboutPageSpinner />

    if (isError) return <div> There was a problem fetching the user  about page request</div>


    return (
        <>
            <div className=" grid grid-cols-12 gap-4 font-sans mt-5 ">

                <div className=" col-span-12   sm:col-span-8  p-8 pr-10 pl-0">
                    <div className='text-zinc-600 text-[19px] font-bold  pb-[17px] bg-slate-100  p-3 pt-5 mb-7 flex items-center  dark:bg-zinc-900 dark:text-zinc-500 '>
                        {(user.username || user.name) + "'s"}  Posts
                        <div className="flex-grow" />
                        <b className='ml-6  text-[11px] font-sans font-bold bg-violet-200 px-3 py-1 text-white rounded-md  dark:bg-violet-600/40'>
                            {user?.posts?.length} Post
                        </b>
                    </div>

                    <div>
                        {
                            user?.posts?.map((item, index: number) => (
                                <AboutPostItem key={index} post={item} />
                            ))
                        }
                        {
                            user?.posts?.length === 0 && <div className="text-zinc-500 font-semibold text-[13px]  pb-[17px] bg-violet-50  p-3 pt-5 mb-7
                            dark:bg-zinc-800/70">
                                {
                                    session?.email === user.email ?
                                        'You have no published posts. We are eagerly waiting for your first post.🚀' :
                                        'This user has no published posts. We are eagerly waiting for their first post.🚀'
                                }
                            </div>

                        }
                    </div>

                </div>

                <div className='col-span-1' ></div>
                <UserProfileSidebar
                    subEmail={subEmail}
                />
            </div>

            <CustomConfetti />

        </>

    )
}