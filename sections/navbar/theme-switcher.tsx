"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { MdSunny } from "react-icons/md";

export const ThemeSwitcher = () => {

    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (

        <span onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='hover:bg-slate-200/60 hover:dark:bg-violet-100/15  rounded-md cursor-pointer transition-colors dark:text-gray-500/80 dark:bg-violet-100/10 p-[0.7rem]
              bg-slate-200/50 ' >
            {theme === 'dark' ? <MdSunny /> : <BsFillMoonStarsFill
                className="text-zinc-600/80 "
            />}
        </span>
    );
};