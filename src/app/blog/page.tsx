import BlogIndexClient from '@/components/sections/blog-index-client';
import { getAllPosts } from '@/lib/posts';

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return <BlogIndexClient posts={posts} />;
}
