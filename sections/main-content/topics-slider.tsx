"use client"
import React, { useRef, useState, useEffect } from 'react'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TopicsSliderLoadingSkeleton } from '@/components/main-content/loading-skeletons/topics-slider-skeleton';
import { useGetTopics } from '@/services/queries';

type Props = {
    setPageIndex: React.Dispatch<React.SetStateAction<string>>
    scrollMode: "infinite" | "pagination"
}

export const TopicsSlider: React.FC<Props> = ({ setPageIndex ,scrollMode}) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [scrollInterval, setScrollInterval] = useState<NodeJS.Timeout | null>(null);
    const currentTag = useSearchParams().get('tag');
    const { topics, topicsLoading } = useGetTopics('userPreferred');

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            if (sliderRef.current) {
                sliderRef.current.scrollLeft += event.deltaY;
            }
        };

        const sliderElement = sliderRef.current;
        if (sliderElement) {
            sliderElement.addEventListener('wheel', handleWheel);
        }

        return () => {
            if (sliderElement) {
                sliderElement.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    useEffect(() => {
        if (sliderRef.current && currentTag) {
            const currentTagElement = sliderRef.current.querySelector<HTMLDivElement>(`[data-tag="${currentTag}"]`);
            if (currentTagElement) {
                const tagPosition = currentTagElement.offsetLeft;
                sliderRef.current.scrollTo({ left: tagPosition, behavior: 'smooth' });
            }
            setPageIndex('1');

        }


    }, [currentTag , setPageIndex]);

    const startAutoScroll = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const scrollAmount = 75;
            const interval = setInterval(() => {
                sliderRef.current!.scrollLeft += direction === 'right' ? scrollAmount : -scrollAmount;
            }, 30);
            setScrollInterval(interval);
        }
    };

    const stopAutoScroll = () => {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            setScrollInterval(null);
        }
    };

    if (topicsLoading) return <TopicsSliderLoadingSkeleton />;

    return (
        <div className='relative border-b border-gray-200  dark:border-zinc-800/70 pb-1 pr-4   ' style={{ width: 'calc(100% - 165px)' }}>

            <div className='pl-4 relative overflow-x-hidden overflow-y-hidden scroll-smooth snap-x  '
                ref={sliderRef}
            >
                <div className="flex items-center">
                    {
                        [{ id: 0, name: 'All' }, ...topics].map((topic) => (
                            <Link className="text-[13px] font-body text-gray-600 mr-1" key={topic.id}
                                href={topic.name === 'All' ? `/` :
                                    scrollMode === 'infinite' ? `?tag=${topic.name}` : `?page=1&tag=${topic.name}`}
                            >
                                <div className={`flex items-center justify-center py-2 px-4 rounded-xl cursor-pointer   ${currentTag !== topic.name && '  hover:bg-gray-200 hover:dark:bg-gray-900 '}   snap-start scroll-mx-3 transition-all duration-300 ease-in-out 
                                     ${currentTag === topic.name ? 'bg-violet-100  dark:bg-violet-800/30 ' : 
                                        currentTag === null && topic.name === 'All' ? 'bg-violet-100 dark:bg-violet-900/45' : 'bg-gray-100 dark:bg-zinc-900 '}`}
                                    data-tag={topic.name}
                                >
                                    <p className='text-[12.5px] font-body text-gray-600
                                    dark:text-gray-400
                                    whitespace-nowrap overflow-hidden overflow-ellipsis'>{topic.name}</p>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>

            <div className="absolute top-[2px] right-[-7px] bottom-0 flex items-center justify-center cursor-pointer text-3xl rounded-full 
              transition-all duration-100 ease-in-out bg-gray-100 shadow-gray-200 dark:shadow-zinc-600 w-8 h-8 shadow-sm opacity-90 dark:bg-zinc-900"
                onMouseDown={() => startAutoScroll('right')}
                onMouseUp={stopAutoScroll}
                onMouseLeave={stopAutoScroll}
            >
                <HiOutlineChevronRight
                    size={15}
                    className='text-gray-600 hover:text-gray-800'
                />
            </div>
            <div
                className="absolute top-[2px] left-[-18px] bottom-0 flex items-center justify-center cursor-pointer text-3xl rounded-full
              transition-all duration-100 ease-in-out bg-gray-100 shadow-gray-200 dark:shadow-zinc-600 w-8 h-8 shadow-sm opacity-90 z-10 dark:bg-zinc-900"
                onMouseDown={() => startAutoScroll('left')}
                onMouseUp={stopAutoScroll}
                onMouseLeave={stopAutoScroll}
            >
                <HiOutlineChevronLeft
                    size={15}
                    className='text-gray-600 hover:text-gray-800'
                />
            </div>
        </div>
    )
}