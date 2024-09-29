"use client"
import { useState } from "react"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCreatePost } from "@/services/mutations";
import { ISession } from "@/types/session";
import PostForm from "@/components/post-form";
import { useGetTopics, useGetUserAbout } from "@/services/queries";
import { useSWRConfig } from "swr";
import { ChatBotDrawer } from "@/components/chat-bot/chat-bot-drawer";
import Image from "next/image";

export default function WritePost() {
    const router = useRouter()
    const { data: session } = useSession() as { data: ISession };
    const subEmail = session?.email.split('@')[0]
    const { cache } = useSWRConfig()
    const [drawerOpen , setDrawerOpen] = useState(false)
    const { mutate: mutateTopics } = useGetTopics('all');
    const { mutate: mutateAbout } = useGetUserAbout(subEmail);

    const { trigger, isMutating } = useCreatePost()

    const handleCreatePost = async (formData: FormData) => {
        trigger(formData, {
            onSuccess: () => {
                router.push(`/about/@${subEmail}?confetti=true`);
                mutateAbout();
                const cacheKeysArray = Array.from(cache.keys());
                cacheKeysArray.forEach(key => {
                    if (key.startsWith('/posts?')) {
                        cache.delete(key);
                    }
                });

                mutateTopics();
            }
        });
    };

    return (
        <>
        <PostForm
            onSubmit={handleCreatePost}
            isMutating={isMutating}
            buttonLabel="Publish"
            drawerOpen = {drawerOpen}
        />
        <ChatBotDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
        />
        <button
            onClick={() => setDrawerOpen(true)}
            className='fixed bottom-2 right-[-5px]  text-white rounded-md px-5 py-3 z-2 sm:block  hidden'
        >
            <Image
                src="/gemini.png"
                alt="gemini"
                className="rounded-full  object-contain w-14 h-14 cursor-pointer  hover:scale-110 shadow-2xl   transition duration-300 ease-in-out   border border-gray-300/20 dark:shadow-white/60 dark:border-white/10"
                onClick={() => setDrawerOpen(true)}
                width={56}
                height={56}
            />
        </button>
        </>

    )
}