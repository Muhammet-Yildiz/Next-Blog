import { useState, useCallback, useRef, useEffect, RefObject } from "react";
import { ITopic } from "@/types";
import { radioCanada } from "@/lib/fonts";
import { RiCloseLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { EditorWrapper } from "./editor-wrapper";
import { AddTagsPopover } from "./add-tags-popover";

type PostFormProps = {
    onSubmit: (formData: FormData) => Promise<void>;
    initialData?: {
        id: string;
        title: string;
        content: string;
        tags: ITopic[];
        imageArray: string[];
    };
    isMutating: boolean;
    buttonLabel: string;
    drawerOpen?: boolean;
};

export default function PostForm({ onSubmit, initialData, isMutating, buttonLabel, drawerOpen }: PostFormProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [selectedTags, setSelectedTags] = useState<ITopic[]>(initialData?.tags || []);
    const [newTags, setNewTags] = useState<string[]>([]);
    const [editorInstance, setEditorInstance] = useState(initialData?.content || {});
    const [imageArray, setImageArray] = useState<string[]>(initialData?.imageArray || []);
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const textareaRef: RefObject<HTMLTextAreaElement> = useRef(null);
    const handleSubmit = useCallback(async () => {
        setIsPublishing(true);
        await clearEditorLeftoverImages();

        // @ts-ignore
        const firstImageBlock = editorInstance?.blocks?.find(block => block.type === 'image');

        if (!firstImageBlock && imageArray.length === 0) {
            setIsPublishing(false);
            toast.error('Please upload an image for the post');
            return;
        }

        if (selectedTags.length === 0 && newTags.length === 0) {
            setIsPublishing(false);
            toast.error('Please add at least one tag');
            return;
        }
        // @ts-ignore
        if (!editorInstance?.blocks) {
            setIsPublishing(false);
            toast.error('Please make changes to the post content');
            return;
        }

        const formData = new FormData();
        formData.append("id", initialData?.id || '');
        formData.append("title", title);
        formData.append("imageUrl", firstImageBlock?.data?.file?.url);
        formData.append("content", JSON.stringify(editorInstance));
        formData.append("relatedtags", JSON.stringify(selectedTags.map(tag => tag.id)));
        formData.append("newTags", JSON.stringify(newTags));

        try {
            await onSubmit(formData);
        } catch (error) {
            toast.error('Failed to submit post');
        }
    }, [title, selectedTags, editorInstance, imageArray, newTags]);

    const clearEditorLeftoverImages = async () => {
        const currentImages: string[] = [];
        document.querySelectorAll('.image-tool__image-picture').forEach((img: any) => {
            currentImages.push(img.src.includes("/posts/") && img.src);
        });

        if (imageArray.length > currentImages.length) {
            for (const path of imageArray) {
                if (!currentImages.includes(path)) {
                    try {
                        await fetch("/api/posts/images/delete", {
                            method: "POST",
                            body: JSON.stringify({ imagePath: path }),
                        }).then(res => res.json());
                    } catch (err: any) {
                        console.log(err);
                    }
                }
            }
        }
    };
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [title]);

    return (
        <div className={`
            ${drawerOpen ? "max-w-4xl  p-3 pl-0" : "max-w-4xl mx-auto p-3"}
            rounded-md  border border-gray-100   relative dark:border-zinc-800/40     
            `}
        >

            <div className="w-full sm:w-[650px] mx-auto relative">
                <textarea
                    ref={textareaRef}
                    placeholder="Enter Title"
                    className={`${radioCanada.className} w-full h-auto py-2 outline-none font-bold pl-0 text-[1.6rem] bg-transparent tracking-normal resize-none overflow-hidden  `}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    rows={1}
                />
                <AddTagsPopover
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    setNewTags={setNewTags}
                    newTags={newTags}
                />
            </div>

            <div className="w-[650px] mx-auto relative flex gap-3 my-2 mt-1 flex-wrap justify-start">
                {selectedTags.map((tag, index) => (
                    <div key={tag.id + index} className="flex items-center gap-2 bg-violet-100 p-2 rounded-md w-auto dark:bg-violet-500/30">
                        <p className="text-gray-800 text-[11px] font-semibold dark:text-slate-400">{tag.name}</p>
                        <button onClick={() => setSelectedTags(selectedTags.filter(t => t.id !== tag.id))}>
                            <RiCloseLine className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                ))}
                {newTags.map((tag, index) => (
                    <div key={index + tag} className="flex items-center gap-2 bg-green-200 p-2 rounded-md w-auto dark:bg-green-700/40">
                        <p className="text-gray-800 text-[11px] font-semibold dark:text-slate-400">{tag}</p>
                        <button onClick={() => setNewTags(newTags.filter(t => t !== tag))}>
                            <RiCloseLine className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                ))}
            </div>

            <EditorWrapper
                data={editorInstance}
                onInstance={(instance) => setEditorInstance(instance)}
                setImageArray={setImageArray}
            />

            <button
                className={`absolute bottom-5  right-0 sm:right-14 md:right-28 bg-violet-500 text-white rounded-md px-[15px] py-2 hover:bg-violet-600 transition duration-300 ease-in-out text-sm font-semibold disabled:bg-slate-300
                dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400
                    z-30  ${isPublishing || isMutating || !title ? "cursor-default" : "cursor-pointer"}`}
                disabled={isMutating || isPublishing || !title}
                onClick={() => isMutating || isPublishing ? null : handleSubmit()}
            >
                {isMutating || isPublishing ? "Publishing..." : buttonLabel}
            </button>
        </div>
    );
}