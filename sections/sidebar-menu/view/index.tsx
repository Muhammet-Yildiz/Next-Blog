"use client";

import {  useEffect, useState } from 'react'

import { PopularPosts } from '../popular-posts';
import { WhoToFollow } from '../who-to-follow';
import RecommendedTopics from '../recommended-topics';
import { SavedPosts } from '../saved-posts';

export default function SidebarMenu() {

    const [scrollTop, setScrollTop] = useState(0);

    useEffect(() => {

        const handleScroll = () => setScrollTop(window.scrollY)

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);


    return (
        <div className={` sm:w-3/12  hidden  md:block   font-sans pr-3  lg:pr-8 space-y-9 overflow-x-hidden  z-50 
          ${scrollTop > 100 ? 'sticky mt-[auto] bottom-0 ' : 'relative'}`} >

            <PopularPosts />

            <WhoToFollow />

            <RecommendedTopics />

            <SavedPosts />


        </div>
    )
}