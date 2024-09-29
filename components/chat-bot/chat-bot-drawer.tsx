import React, { RefObject, useEffect, useRef } from "react";
import { CustomUserImage } from "@/components/custom-user-image";
import { ISession } from "@/types/session";
import { useChat } from "ai/react";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { FaTimes } from "react-icons/fa";
import { FaArrowUpLong } from "react-icons/fa6";
import { CgSpinner } from "react-icons/cg";
import { Markdown } from "./markdown";
import Image from "next/image";

type ChatBotDrawerProps = {
    open: boolean;
    onClose: () => void;
};

export const ChatBotDrawer: React.FC<ChatBotDrawerProps> = ({
    open,
    onClose,
}) => {
    const { data: session } = useSession() as { data: ISession };

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        error,
        isLoading
    } = useChat({
        api: "/api/genai",
    });

    const messageEndRef = useRef<HTMLDivElement>(null);
    const textareaRef: RefObject<HTMLTextAreaElement> = useRef(null);
    useEffect(() => {

        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    return (
        <div
            id="drawer"
            className={clsx(
                "fixed inset-0 z-50 flex justify-end w-[530px] h-full",
                open ? " left-[calc(100%-530px)]" : "left-[100%]",
                "transition-all duration-300"
            )}
        >
            <div className="relative flex flex-col w-full h-full overflow-y-auto bg-white shadow-xl dark:bg-black dark:border dark:border-zinc-800/90">
                <div className="bosrder bsorder-green-800 h-full">
                    <div
                        className="flex justify-between items-center border-b p-5 
                    border-gray-200 dark:border-zinc-800/80 pb-2 shadow-sm"
                    >
                        <h2 className="text-lg font-bold text-gray-800 dark:text-neutral-300">
                            Chat Bot
                        </h2>
                        <button onClick={() => onClose()} className="text-gray-500 dark:text-gray-400">
                            <FaTimes className="text-[18px] cursor-pointer" />
                        </button>
                    </div>

                    <div className="sborder bsorder-gray-600/20 h-[calc(100%-120px)] overflow-y-auto 
                     text-black flex-col gap-8 z-50 sborder pr-3 sborder-blue-500 p-5 pl-2 mr-1"
                    >
                        

                        <div className="flex flex-col gap-5 pr-2">
                        <div className="flex gap-4 items-center  rounded-md h-10 "  >
                            <Image
                                src={"/gemini.png"}
                                alt="gemini"
                                className={` rounded-full object-contain w-8 h-8 shadow-lg bg-white dark:bg-zinc-800/60 `}
                            width={32} height={32}
                            />
                            <p className="text-[13px] bg-white p-2 rounded-md shadow-md dark:bg-zinc-800/60 dark:text-gray-300"
                            >
                                Hello! 🎉 Welcome to Next Blog . How can I assist you today? 😊
                            </p>
                        </div>
                            {messages?.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-3 items-start relative rounded-md ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {message.role === "user" ? (
                                        <CustomUserImage
                                            src={session?.image}
                                            className="rounded-full object-contain w-8 h-8 shadow-lg bg-white dark:bg-zinc-800/60 p-[6px]"
                                        />
                                    ) : (
                                        <Image
                                            src={"/gemini.png"}
                                            alt="gemini"
                                            className={`
                                                ${isLoading && index === messages.length - 1 && 'animate-bounce'} rounded-full object-contain w-8 h-8 shadow-lg bg-white dark:bg-zinc-800/60
                                                `}
                                                width={32}
                                                height={32}

                                        />
                                    )}
                                    <div
                                        className={`${message.role === "user"
                                            ? " bg-violet-100/70 max-w-[300px] overflow-hidden break-words dark:bg-violet-400/30 !pb-[0] whitespace-pre-wrap"
                                            : "bg-white dark:bg-zinc-800/50 shadow-md"
                                            } p-2 rounded-md text-black  text-[13px] dark:text-gray-300 relative `}
                                    >

                                        <Markdown text={message.content} />
                                        <div
                                            className={`${message.role === "user"
                                                ? 'bg-white dark:bg-black rounded-tr-md rounded-tl-md' : null} absolute bottom-0 left-0 right-0 h-[13px] w-full   `}

                                        />
                                    </div>

                                </div>
                            ))}

                            <div ref={messageEndRef} />
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex gap-3 items-center bg-white p-1 pl-3 rounded-md rounded-t-none absolute bottom-2 left-0 right-0 z-2 dark:bg-zinc-800/50"
                    >
                        <textarea
                            ref={textareaRef}
                            placeholder="Enter a prompt here"
                            name="input-field"
                            value={input}
                            onChange={handleInputChange}
                            className="w-full py-[12px] rounded-md text-sm pl-3 text-gray-900 outline-none bg-zinc-100 dark:bg-zinc-800/60 dark:text-zinc-300 resize-none  overflow-hidden "
                            autoComplete="off"
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault(); 
                                    handleSubmit();
                                }
                            }}
                        />

                        <button
                            type="submit"
                            disabled={!input || error || isLoading ? true : false}
                            className={`p-[14px] rounded-md text-sm ${!input || error || isLoading
                                ? "cursor-default bg-zinc-300 dark:bg-zinc-800/50"
                                : "cursor-pointer bg-violet-500 hover:bg-violet-600 dark:bg-violet-400/50 dark:hover:bg-violet-400/60"
                                }`}
                        >
                            {
                                isLoading ? <CgSpinner
                                    className="text-[17px] text-white animate-spin"
                                /> : <FaArrowUpLong className="text-[17px] text-white" />
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};