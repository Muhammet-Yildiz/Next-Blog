import React, { useState, useEffect, useRef } from "react";
import cn from "classnames";
import { FaHandsClapping } from "react-icons/fa6";
import { IPost } from "@/types/post";
import { useSession } from "next-auth/react";
import { ISession } from "@/types/session";
import { useLikePost } from "@/services/mutations";
import { useDebounce } from 'use-debounce';
import { useGetTopics } from "@/services/queries";
import { mutate, useSWRConfig } from "swr";
const BUBBLE_THRESHOLD = 1000;
const CLICK_THRESHOLD = 250;
const APPLAUSE_MAX = 50;

export const ApplauseButton = ({ post  }: { post: IPost  }) => {
    const { data: session } = useSession() as { data: ISession };
    const { cache } = useSWRConfig()
    const { mutate: mutatePreferredTopics } = useGetTopics('userPreferred');
    const { trigger } = useLikePost()

    let bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    let clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sparkTilt = Math.random() < 0.5 ? "left" : "right";
    const [applause, setTotalApplause] = useState(0);
    const [active, setIsActive] = useState(false);
    const [clicked, setIsClicked] = useState(false);
    const [likedController, setLikedController] = useState({
        isLiked: false,
        count: 0
    })
    const [increment] = useDebounce(applause, 1000);
    const handleClick = () => {

        setIsActive(true);
        setIsClicked(true);
        setTotalApplause((prevState) => prevState + 1);
        setLikedController({ ...likedController, isLiked: true, count: likedController.count + 1 })
    };

    useEffect(() => {
        if (active) {
            bubbleTimer.current = setTimeout(
                () => setIsActive(false),
                BUBBLE_THRESHOLD
            );
            clickTimer.current = setTimeout(
                () => setIsClicked(false),
                CLICK_THRESHOLD
            );
        }

        return () => {
            if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
            if (clickTimer.current) clearTimeout(clickTimer.current);
        };
    }, [applause, active]);


    useEffect(() => {
        setLikedController({
            isLiked: session ? session?.likedPosts.includes(post?.id) : false,
            count: post?.likesCount
        })
    }, [post?.id, post?.likesCount, session?.likedPosts])



    useEffect(() => {
        if (increment > 0) {
            handleLikePost()
        }
    }, [increment])

    const handleLikePost = async () => {
        trigger(
            {
                id: post.id,
                likesCount: likedController.count
            },
            {
                optimisticData: setLikedController({ ...likedController, 
                    count: likedController.count,
                    isLiked: true }),
                rollbackOnError: true,
                onSuccess: () => {

                    const cacheKeysArray = Array.from(cache.keys());

                    cacheKeysArray.forEach(key => {
                        if (key.startsWith('/posts?')) {
                            const data = cache.get(key)
                            const posts = data?.data?.posts as IPost[]
                            if (Array.isArray(posts)) {
                                const updatedData = posts.map(item =>
                                    item.id === post.id ? { ...item, likesCount: likedController.count } : item
                                ) as any;
                                cache.set(key, updatedData);
                            }
                        }
                    });


                    cacheKeysArray.forEach(key => {
                        if (key === `/posts/${post?.id}`) {
                            const data = cache.get(key);
                            const post = data?.data?.post
                            if (post?.id) {
                                cache.set(key, { ...post, likesCount: likedController.count })
                             
                            }
                        }
                    });



                    mutatePreferredTopics()

                }
            }

        )

        if (!session?.likedPosts?.includes(post?.id)) {
            session?.likedPosts?.push(post?.id)
        }
    }



    return (

        <div className="outer-container">
            <button
                type="button"
                className={cn("applause-button", {
                    active,
                    inactive: !active,
                    clicked,
                    interacted: likedController.isLiked
                })}
                onClick={handleClick}
                disabled={applause >= APPLAUSE_MAX || session?.id === post?.authorId}
            >
                <FaHandsClapping className={`hands 
                
                ${session?.id === post?.authorId ? 'text-gray-300  dark:text-zinc-600/80' :
                   likedController.isLiked ? 'text-violet-600 dark:text-violet-600/70' : 'text-slate-500 dark:text-gray-400'} text-[17.8px] ml-1 hover:text-violet-600 cursor-pointer  ease-in-out duration-300 `}
                />
                <div className={cn("spark-container", sparkTilt)}>
                    <img src="/spark.svg" alt="spark" className="spark" />
                </div>
                {applause > 0 && <span className="bubble">{`+${applause}`}</span>}
                <p className={`counter  text-gray-500 text-sm dark:text-gray-400  font-normal tracking-wide `}
                >
                    {likedController.count} 
                </p>

            </button>
        </div>

    )
}