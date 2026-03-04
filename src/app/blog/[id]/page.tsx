import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { getAllFilePosts, getPostById } from '@/lib/posts';

type PageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  const posts = getAllFilePosts();
  return posts.map((post) => ({ id: post.id }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  const isRawHtml = post.contentMode === 'raw-html' || /data-content-mode=['"]raw-html['"]/i.test(post.content || '');
  const contentClassName = isRawHtml
    ? 'blog-raw-html max-w-none font-body text-gray-300 leading-relaxed [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:border [&_img]:border-white/10 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-white/10 [&_td]:p-2 [&_th]:border [&_th]:border-white/10 [&_th]:p-2 [&_a]:text-[#39ff14] hover:[&_a]:underline'
    : 'prose prose-invert prose-lg max-w-none prose-headings:font-headline prose-headings:font-bold prose-headings:text-white prose-p:font-body prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-[#39ff14] prose-a:no-underline hover:prose-a:underline prose-code:text-[#ffaa00] prose-code:bg-black/50 prose-code:p-1 prose-code:rounded prose-code:font-mono prose-pre:bg-[#050505] prose-pre:border prose-pre:border-white/10 prose-pre:p-4 prose-img:rounded-xl prose-img:border prose-img:border-white/10';

  return (
    <div className="min-h-screen bg-black pt-8 md:pt-32 pb-20 relative px-4">
      <div className="fixed inset-0 bg-[#39ff14]/5 cyber-grid pointer-events-none z-0" />

      <article className="max-w-3xl mx-auto relative z-10 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {post.imageUrl && (
          <div className="w-full h-64 md:h-96 relative border-b border-[#39ff14]/30">
            <Image src={post.imageUrl} alt={post.title} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
        )}

        <div className="p-8 md:p-12">
          <Link href="/blog" className="inline-flex items-center text-[#39ff14] hover:text-white font-mono text-sm tracking-widest mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" /> BACK TO RECORDS
          </Link>

          <header className="mb-12 border-b border-white/10 pb-8">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-white mb-6 leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-400 font-mono text-sm">
              <span className="flex items-center text-[#39ff14]">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              {post.tags && (
                <span className="flex items-center text-[#00ccff]">
                  <Tag className="w-4 h-4 mr-2" />
                  {post.tags.split(',').map((t) => t.trim()).join(' / ')}
                </span>
              )}
            </div>
          </header>

          <div className={contentClassName} dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  );
}
