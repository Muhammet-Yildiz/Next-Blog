export const TopicsSliderLoadingSkeleton = () => {

    return (
        <div role="status" className=" animate-pulse  border-b border-gray-200 pb-2 dark:border-zinc-800/80"  style={{ width: 'calc(100% - 165px)' }}>
            <div className="flex items-center mt-2  py-[5px]  justify-between  gap-1 pr-2 " >
                {
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-16 "></ div>
                    ))
                }
            </div>

            <span className="sr-only">Loading...</span>
        </div>
    )
}