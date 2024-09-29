import { useState, useEffect } from "react";
import { IoMdArrowUp } from "react-icons/io";

export const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 910);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="group">
            <button
                className={`fixed bottom-6 right-6 text-gray-200 py-[0.65rem] rounded-full z-50 shadow-md ring-1 ring-gray-300  px-[0.82rem] bg-white hover:ring-violet-600 transition-all duration-200   dark:bg-zinc-900 dark:ring-zinc-700
                    dark:hover:ring-violet-600/50 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <div className="flex gap-2 items-center">
                    <IoMdArrowUp
                        className="text-gray-500 transform transition-transform duration-200 group-hover:animate-bounce-up"
                        size={18}
                    />
                    <IoMdArrowUp
                        className="text-gray-500 transform transition-transform duration-200  group-hover:block group-hover:animate-bounce-down absolute bottom-3 left-[0.83rem] group-hover:text-violet-600"
                        size={18}
                    />
                    <p className="text-[14px] font-semibold text-gray-500 font-sans group-hover:text-violet-600">
                        Back to Top
                    </p>
                </div>
            </button>
        </div>
    );
};