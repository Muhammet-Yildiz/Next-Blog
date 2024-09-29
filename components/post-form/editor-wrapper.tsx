import { DMSans } from '@/lib/fonts';
import React, { useEffect, useRef, useState } from 'react';

interface EditorWrapperProps {
    data: any;
    onInstance: (instance: any) => void;
    setImageArray: React.Dispatch<React.SetStateAction<string[]>>;
}

export const EditorWrapper: React.FC<EditorWrapperProps> = ({ onInstance, setImageArray, data }) => {
    const ref = useRef<any>(null);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const initializeEditor = async () => {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const List = (await import("@editorjs/list")).default;
        const Embed = (await import("@editorjs/embed")).default;
        const Paragraph = (await import("@editorjs/paragraph")).default;
        const AlignmentBlockTune = (await import("editorjs-text-alignment-blocktune")).default;
        const CheckList = (await import("@editorjs/checklist")).default;
        const Strikethrough = (await import("@sotaproject/strikethrough")).default;
        const ChangeCase = (await import("editorjs-change-case")).default;
        const Delimiter = (await import("@editorjs/delimiter")).default;
        const Marker = (await import("@editorjs/marker")).default;
        const Quote = (await import("@editorjs/quote")).default;
        const Image = (await import("@editorjs/image")).default;

        if (ref.current) {
            const editor = new EditorJS({
                holder: ref.current,
                inlineToolbar: true,
                tools: {
                    textAlignment: {
                        class: AlignmentBlockTune,
                        config: { default: "left", blocks: {} },
                    },
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                        tunes: ["textAlignment"],
                        config: { placeholder: "Enter a paragraph", preserveBlank: true },
                    },
                    header: {
                        class: Header,
                        inlineToolbar: true,
                        tunes: ["textAlignment"],
                        config: { placeholder: "Enter a header", levels: [2, 3, 4, 5], defaultLevel: 3 },
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                        config: { defaultStyle: "unordered" },
                    },
                    image: {
                        class: Image as any,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    const formData = new FormData();
                                    formData.append("image", file);

                                    return await fetch("/api/posts/images/upload", {
                                        method: "POST",
                                        body: formData,
                                    }).then((res) => res.json()).then((res) => {
                                        setImageArray((prev) => [...prev, process.env.NEXT_PUBLIC_AWS_S3_IMAGE_HOST_URI + '/posts/' + res.fileName]);
                                        return {
                                            success: 1,
                                            file: {
                                                url: process.env.NEXT_PUBLIC_AWS_S3_IMAGE_HOST_URI + '/posts/' + res.fileName,
                                            }
                                        };
                                    });
                                },
                            },
                        },
                    },
                    checklist: {
                        class: CheckList,
                        inlineToolbar: true,
                        config: { placeholder: "Enter a checklist" },
                    },
                    strikethrough: { class: Strikethrough },
                    delimiter: Delimiter,
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                        config: { placeholder: "Enter a quote" },
                    },
                    changeCase: ChangeCase,
                    marker: { class: Marker, config: {} },
                    embed: {
                        class: Embed,
                        config: {
                            services: {
                                youtube: true,
                                codepen: true,
                            },
                        },
                    },
                },
                onChange: () => {
                    editor.save().then((outputData) => {
                        onInstance(outputData);
                    }).catch((error) => {
                        console.log('Saving failed: ', error);
                    });
                },
                onReady: () => {
                    if (data && data.length > 0) {
                        editor.render(JSON.parse(data)); 
                    }
                },
            });

            ref.current = editor;
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsMounted(true);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            await initializeEditor();
        };

        if (isMounted) {
            init();

            return () => {
                if (ref.current) {
                    ref.current = null;
                }
            };
        }
    }, [isMounted, data]);

    return <div ref={ref} className={`${DMSans.className} rounded-md min-h-[520px] editorjs-wrapper`} />;
};
