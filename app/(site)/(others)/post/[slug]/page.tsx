import PostDetail from "@/sections/post-detail/view";
import { Metadata } from "next";

async function getPost(slug: string) {
  const id = slug.split('--')[1]
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post data');
  }
  return response.json();
}


export async function generateMetadata({ params }: { params: { slug: string } }) : Promise<Metadata> {
  try {
    const { post } = await getPost(params.slug);
    return {
      title: `${post.title} | by ${(post.author?.username || post.author?.name)}`,
      description: 'Post Detail Page',
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
      description: 'Post not found or an error occurred.',
    };
  }
}


export default function PostDetailPage({ params }: { params: { slug: string } }) {
 
  return <PostDetail  slug ={params.slug} />

}
