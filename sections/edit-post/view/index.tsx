import { ChatBotDrawer } from "@/components/chat-bot/chat-bot-drawer";
import PostForm from "@/components/post-form";
import { useEditPost } from "@/services/mutations";
import { useGetPost, useGetTopics, useGetUserAbout } from "@/services/queries";
import { IPost } from "@/types/post"
import { ISession } from "@/types/session";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useSWRConfig } from "swr";

export default function EditPost({ post }: { post: IPost }) {
    const { data: session } = useSession() as { data: ISession };
    const router = useRouter()
    const { cache } = useSWRConfig()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const { mutate: mutateGetPost } = useGetPost(`title--${post.id}`);
    const subEmail = session?.email.split('@')[0]
    const { mutate: mutateAbout } = useGetUserAbout(subEmail);

    const { mutate: mutateTopics } = useGetTopics('all');
    const { trigger, isMutating } = useEditPost()

    const imageArray = useMemo(() => {
        const imageArray = []
        for (const block of JSON.parse(post.content)?.blocks) {
            if (block.type === 'image') {
                imageArray.push(block.data.file.url)
            }
        }
        return imageArray
    }, [post.content])

    const handleEditPost = async (formData: FormData) => {
        trigger(formData, {
            onSuccess: () => {
                router.push(`/about/@${subEmail}?confetti=true`);
                mutateAbout()
                mutateGetPost()
                const cacheKeysArray = Array.from(cache.keys());
                cacheKeysArray.forEach(key => {
                    if (key.startsWith('/posts?')) {
                        cache.delete(key);
                    }
                });

                mutateTopics()
            },
        });

    };

    return (
        <>
            <PostForm
                onSubmit={handleEditPost}
                initialData={{
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    tags: post.relatedTags || [],
                    imageArray: imageArray
                }}
                isMutating={isMutating}
                buttonLabel="Save Changes"
                drawerOpen={drawerOpen}
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