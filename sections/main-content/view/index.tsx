"use client"
import React, { useState } from 'react'
import { CardList } from '../card-list'
import { ViewAs } from '../view-as'
import { TopicsSlider } from '../topics-slider'
import { SortSelectorAs } from '../sort-selector-as'
import { SortType } from '@/types'
import { BackToTopButton } from '@/components/back-to-top-button'
import { useSearchParams } from 'next/navigation'
import { InfiniteCardList } from '../infinite-card-list'
import { ScrollModeAs } from '../scroll-mode-as'
import { OneTapSignin } from '@/components/one-tap-signin'


export default function MainContent() {
    const { isLoading: oneTapIsLoading } = OneTapSignin({
        redirect: false,
        parentContainerId: "oneTap",
    });

    const [scrollMode, setScrollMode] = useState<"infinite" | "pagination">("pagination");

    const [pageIndex, setPageIndex] = useState(useSearchParams().get('page') || '1')

    const [viewAs, setViewAs] = useState<'grid' | 'list'>('grid')

    const [sortType, setSortType] = useState<SortType>('RECOMMENDED');

    return (
        <div className='flex flex-col  sm:w-9/12 w-full xl:pl-10 md:pl-8   md:border-l md:border-gray-200   md:dark:border-zinc-800/80 '  >
            <div id="oneTap" style={{ position: "fixed", top: "0", right: "0", zIndex: "1000" }} />

            <div className='flex  mb-5 justify-between relative '>

                <TopicsSlider setPageIndex={setPageIndex} scrollMode={scrollMode} />
                <ScrollModeAs scrollMode={scrollMode} setScrollMode={setScrollMode} />
                <SortSelectorAs sortType={sortType} setSortType={setSortType} setPageIndex={setPageIndex} scrollMode={scrollMode} />
                <ViewAs viewAs={viewAs} setViewAs={setViewAs} />

            </div>

            {
                scrollMode === "pagination" ? <>
                    <CardList viewAs={viewAs} sortType={sortType} pageIndex={pageIndex} setPageIndex={setPageIndex} />
                    <div className='hidden'>
                        <CardList viewAs={viewAs} sortType={sortType} pageIndex={String(parseInt(pageIndex) + 1)} setPageIndex={setPageIndex} />
                    </div>
                </>
                    :
                    <InfiniteCardList viewAs={viewAs} sortType={sortType} />
            }


            <BackToTopButton />

        </div>
    )
}