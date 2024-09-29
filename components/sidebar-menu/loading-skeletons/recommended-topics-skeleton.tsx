export const RecommendedTopicsLoadingSkeleton = () => {
    return (
        <div role="status" className=" animate-pulse  ">
            <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-60 mb-2.5"></div>
            <div className="flex  items-center mt-2  py-[5px]  justify-between flex-wrap gap-3 pr-2" >
                {
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 "></ div>
                    ))
                }
            </div>

            <span className="sr-only">Loading...</span>
        </div>
    )
}