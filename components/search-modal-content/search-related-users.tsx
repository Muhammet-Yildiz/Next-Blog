import { IBasicUsers } from "@/types/user"
import { useRouter } from "next/navigation"
import Highlighter from "react-highlight-words"
import { CustomUserImage } from "../custom-user-image"

type Props = {
    users: IBasicUsers,
    query: string,
    handleClose: () => void
}
export const SearchRelatedUsers: React.FC<Props> = ({ users, query, handleClose }) => {
    const router = useRouter()

    return (
        !!users.length && (
            <>
                <p className="text-[13px] font-semibold text-gray-600 mb-3 dark:text-neutral-300 " >
                    Related Users
                </p>

                {users.map((user) => (

                    <div key={user.id}
                        className="flex  items-center mb-3 cursor-pointer bg-white px-1 py-[0.3rem] rounded-md dark:bg-zinc-900 "
                        onClick={() => {
                            router.push(`/about/@${user?.email?.split('@')[0]}`)

                            handleClose()
                        }}
                    >

                        <CustomUserImage src={user?.image}
                            className="mr-4 object-contain w-16 h-8 rounded-sm bg-slate-100 dark:bg-neutral-800/50"
                            alt="user"
                        />

                        <p className="text-[11.6px] font-semibold text-gray-600 dark:text-neutral-400" >
                            <Highlighter
                                searchWords={[query]}
                                textToHighlight={user?.username as string || user?.name as string}
                                autoEscape={true}
                            />
                        </p>
                        <div className="flex-grow" />
                        <p className="text-[11.2px]  text-gray-500 bg-violet-50 p-1 dark:bg-violet-900/45 dark:text-neutral-400" >
                            User
                        </p>

                    </div>

                ))}
            </>
        )
    )
}