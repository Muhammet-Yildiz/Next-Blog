import { signOut } from "next-auth/react";
import { ActionModal } from "./action-modal"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDeleteAccount } from "@/services/mutations";

export const DeleteAccountButton = () => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const { trigger, isMutating } = useDeleteAccount()

    const handleDeleteAccount = () => {
        trigger().then(() => {
            toast.success(' Account deleted successfully')
            setIsOpen(false)
            signOut()
            router.push(`/`)

        }).catch((error: any) => {
            console.log(error)
        })
    }


    return (
        <>
            <button type="button"
                className="border border-violet-500 p-3  text-center  text-violet-500 rounded-sm   py-2  hover:bg-violet-50   transition duration-300
                ease-in-out  text-[12px]   font-semibold  disabled:bg-slate-300 cursor-pointer z-50 w-[150px] "
                onClick={() => setIsOpen(true)}
            >
                Delete Account
            </button>

            <ActionModal
                isOpen={isOpen}
                variant="post_delete"
                content={
                    <div className=" flex flex-col  items-center " >

                        <FaExclamationTriangle
                            size={55}
                            className="text-violet-600 mt-8 mb-4 bg-violet-200 p-3 rounded-md"
                        />
                        <h3 className="text-xl font-bold p-5 " >
                            Are you sure ?
                        </h3>

                        <div className="px-8 pt-3 pb-8 text-center " >

                            Deleting your account remove all of your information from our database. This process cannot be undone.
                        </div>
                        <div className="flex flex-col   pt-1 pb-8  w-full px-5">
                            <button
                                onClick={() => {
                                    isMutating ? null : handleDeleteAccount()
                                }}
                                className={` text-[12px] border font-bold    rounded-md p-3 transition   text-white mb-3
                                    ${isMutating ? "bg-slate-200 cursor-default " : "bg-violet-600 hover:bg-violet-700 cursor-pointer"}  `}
                            >
                                {isMutating ? "Deleting..." : "Delete Account"}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className=" cursor-pointer text-[12px] border font-bold   rounded-md p-3  transition   bg-gray-600  text-white"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                }
                handleClose={() => setIsOpen(false)}
            />
        </>
    )
}