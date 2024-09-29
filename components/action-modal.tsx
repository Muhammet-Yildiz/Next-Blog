import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { Fragment } from "react"

type Props = {
    isOpen: boolean
    handleClose: () => void
    title?: string | JSX.Element
    content: string | JSX.Element
    variant?: 'follow' | 'search' | 'account_delete' | 'post_delete'
}

export const ActionModal: React.FC<Props> = ({ isOpen, handleClose, title, content, variant }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50 " onClose={handleClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </TransitionChild>
                <div className="fixed inset-0 overflow-y-auto  ">
                    <div className="flex min-h-full items-center justify-center !p-8 sm:!p-24 text-center font-sans  top-0   ">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className={` w-full
                            ${variant === 'post_delete' || variant === 'account_delete' ? 'max-w-lg' : 'max-w-3xl'}
                          transform absolute overflow-hidden rounded-xl bg-white  dark:bg-zinc-950 dark:text-neutral-200
                          border dark:border-zinc-800/70
                          text-left align-middle shadow-xl transition-all  p-0 
                            ${title ? 'top-28' : variant ? 'top-36' : ' top-16'}  `}

                            >
                                {title && <DialogTitle
                                    as="h3"
                                    className="text-lg px-8 pt-8  font-medium leading-6 text-gray-900 dark:text-neutral-300"
                                >
                                    {title}
                                </DialogTitle>
                                }

                                {content}

                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}