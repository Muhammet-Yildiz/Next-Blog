import { SortType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
    totalPages: number,
    currentPage: string,
    setPageIndex: React.Dispatch<React.SetStateAction<string>>,
    sortType: SortType
}

export const PaginationButtons: React.FC<Props> = ({ totalPages, currentPage, setPageIndex, sortType }) => {
    const currentTag = useSearchParams().get('tag');
    const pageIndex = useSearchParams().get('page') || '1';
    const router = useRouter();
    const currentPageNumber = parseInt(currentPage);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPageIndex(String(newPage));
            window.scrollTo({ top: 0, behavior: 'smooth' });
            router.push(`?page=${newPage}${currentTag ? `&tag=${currentTag}` : ''}${sortType ? `&sort=${sortType}` : ''}`);
        }
    };

    useEffect(() => {
        setPageIndex(pageIndex);
    }, [pageIndex, setPageIndex]);

    const renderPageNumbers = () => {
        const pageButtons = [];
        const maxVisiblePages = 5; 

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageButtons.push(renderPageButton(i));
            }
        } else {
            let startPage = Math.max(currentPageNumber - 1, 2);
            let endPage = Math.min(currentPageNumber + 1, totalPages - 1);

            if (currentPageNumber <= 2) {
                endPage = Math.max(3, endPage);
            } else if (currentPageNumber >= totalPages - 1) {
                startPage = Math.min(totalPages - 2, startPage);
            }

            pageButtons.push(renderPageButton(1));

            if (startPage > 2) {
                pageButtons.push(<span key="start-ellipsis">...</span>);
            }

            for (let i = startPage; i <= endPage; i++) {
                pageButtons.push(renderPageButton(i));
            }

            if (endPage < totalPages - 1) {
                pageButtons.push(<span key="end-ellipsis">...</span>);
            }

            pageButtons.push(renderPageButton(totalPages));
        }

        return pageButtons;
    };

    const renderPageButton = (page: number) => (
        <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-[0.83rem] py-[0.3rem] shadow-sm rounded ${currentPageNumber === page ? 'bg-violet-500 text-white' : 'bg-white text-gray-700 border'}`}
        >
            {page}
        </button>
    );

    return (
        <div className={`flex justify-center items-center gap-4 mt-7 mb-8 ${totalPages === 1 ? 'hidden' : ''}`}>
            <button
                onClick={() => handlePageChange(currentPageNumber - 1)}
                disabled={currentPageNumber === 1}
                className="px-3 py-[0.68rem] rounded disabled:opacity-50 border shadow-sm hover:disabled:bg-white hover:bg-gray-100 transition duration-200 ease-in-out bg-white"
            >
                <FaArrowLeft size={12} className="text-gray-700" />
            </button>

            {renderPageNumbers()}

            <button
                onClick={() => handlePageChange(currentPageNumber + 1)}
                disabled={currentPageNumber === totalPages}
                className="px-3 py-[0.68rem] rounded disabled:opacity-50 border shadow-sm hover:disabled:bg-white hover:bg-gray-100 transition duration-200 ease-in-out bg-white"
            >
                <FaArrowLeft size={12.5} className="text-gray-700 rotate-180" />
            </button>
        </div>
    );
};