import { ITopic } from "@/types"
import Link from "next/link"

export const RelatedTags = ({tags} : {tags: ITopic[]}) => {

    return (
        <div className="flex  gap-3 mb-12 mt-16  pt-2   ">
            <div className="flex gap-3   flex-wrap ">
                {
                    tags.map((tag, i) => (
                        <Link key={i}
                            href={`/?tag=${tag.name}`} >
                            <p
                                className="text-xs font-semibold text-violet-600  bg-violet-100 rounded-xl px-6 py-2 cursor-pointer hover:bg-violet-200 transition-all duration-300 ease-in-out hover:text-violet-700 dark:bg-violet-800/40 dark:text-neutral-400  dark:hover:bg-violet-800/50 "
                            >
                                {tag.name}
                            </p>
                        </Link>
                    ))
                }
            </div>
        </div>

    )

}