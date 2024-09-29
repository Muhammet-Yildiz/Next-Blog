export const DetailPageLoadingSkeleton = () => {

    return (
        <div className="w-full md:max-w-4xl mx-auto  ">
            <div role="status" className="my-7 animate-pulse    items-center justify-center relative mx-auto  max-w-2xl    ">
                <div className="h-5 bg-gray-200 rounded-sm dark:bg-gray-700 w-full mb-3" />
                <div className='flex items-center pb-2 gap-2'>

                    <svg className="w-9 h-9 me-0  text-gray-200 dark:text-gray-700" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                    </svg>

                    <div className='pt-2'>
                        <div className="h-3.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                        <div className="w-48 h-3 bg-gray-200 rounded-full dark:bg-gray-700 mb-2" ></div>

                    </div>
                </div>


                <div className='mt-4 flex gap-3 mb-6'>
                    <div className="h-4 w-8 bg-gray-200 rounded dark:bg-gray-700" />
                    <div className="h-4 w-8 bg-gray-200 rounded dark:bg-gray-700" />
                    <div className="h-4 w-8 bg-gray-200 rounded dark:bg-gray-700" />
                    <div className="flex-grow " />
                    <div className="h-4 w-8 bg-gray-200 rounded dark:bg-gray-700" />
                    <div className="h-4 w-8 bg-gray-200 rounded dark:bg-gray-700" />
                </div>

                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-11/12 mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-3/4 mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-7/12 mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2 mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-5/12 mb-2.5" />


            </div>


            <div role="status" className="  animate-pulse mx-auto  max-w-2xl ">
                <div className="flex items-center justify-center w-full h-[21rem] bg-gray-300 rounded dark:bg-gray-700  ">
                    <svg className="w-12 h-12 text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"></path>
                    </svg>
                </div>

            </div>

        </div>

    )
}