import { ITopic } from "@/types"
import { useRouter } from "next/navigation";
import Highlighter from "react-highlight-words";
import { FaTag } from "react-icons/fa6";

type Props = {
    topics: ITopic[],
    query: string,
    handleClose: () => void
}
export const SearchRelatedTopics: React.FC<Props> = ({ topics, query, handleClose }) => {
    const router = useRouter()
    return (
        !!topics.length && (

            <>
                <p className="text-[13px] font-semibold text-gray-600 mb-2 dark:text-neutral-300" >
                    Related Topics
                </p>
                <div
                    className="flex flex-wrap gap-3"
                >

                    {topics.map((topic) => (

                        <div key={topic.id}
                            className="inline-flex  items-center mb-2 -pointer bg-white px-2 py-[0.3rem] rounded-md cursor-pointer dark:bg-zinc-900 "
                            onClick={() => {
                                router.push(`/?tag=${topic.name}`)
                                handleClose()
                            }}
                        >
                            <FaTag size={12}
                                className="text-violet-500 mr-2"
                            />
                            <p className="text-[11.6px] font-semibold text-gray-600  dark:text-neutral-400" >
                                <Highlighter
                                    searchWords={[query]}
                                    textToHighlight={topic?.name}
                                    autoEscape={true}
                                />
                            </p>

                        </div>

                    ))}
                </div>

            </>
        )

    )
}