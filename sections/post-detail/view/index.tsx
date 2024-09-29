"use client"
import { DetailPageLoadingSkeleton } from "@/components/post-detail/loading-skeletons/detail-page-skeleton";
import { useGetPost } from "@/services/queries";
import { PostDetailsHeader } from "../post-details-header";
import { RelatedTags } from "../related-tags";
import Output from "editorjs-react-renderer";
import { CustomImage, CustomParagraph, textFormatStyles } from "../../../components/post-detail/post-content-styles";
import { BackToTopButton } from "@/components/back-to-top-button";
import { notFound } from "next/navigation";
import { montserrat } from "@/lib/fonts";
import { RecommendedSection } from "../recommended-section";

export default function PostDetail({ slug }: { slug: string }) {

    const { post, postLoading, isError } = useGetPost(slug)

    if (postLoading) return <DetailPageLoadingSkeleton />

    if (isError) return notFound()


    return (

        <div className="font-sans max-w-2xl mx-auto p-4 mt-3 ">

            <h2 className={` ${montserrat.className} text-2xl sm:text-[30px] font-extrabold mb-2 tracking-[-.015em]  text-gray-800 leading-8 sm:leading-10 dark:text-neutral-300 break-words`}>
                {post?.title}
            </h2>

            <PostDetailsHeader
                displayAuthorInfo
                slug={slug}
            />

            <div className='editorjs-wrapper-renderer'>
                {post?.content && (
                    <>
                        {(() => {
                            try {
                                return (
                                    <Output
                                        data={JSON.parse(post?.content)}
                                        style={textFormatStyles}
                                        renderers={{
                                            paragraph: CustomParagraph,
                                            image: CustomImage,
                                        }}
                                    />
                                );
                            } catch (error) {
                                console.error("Error parsing content:", error);
                                return null;
                            }
                        })()}
                    </>
                )}
            </div>

            {post?.relatedTags && <RelatedTags tags={post?.relatedTags} />}


            <PostDetailsHeader
                displayAuthorInfo={false}
                slug={slug}
            />

            <RecommendedSection post={post} />

            <BackToTopButton />

        </div >

    )
}