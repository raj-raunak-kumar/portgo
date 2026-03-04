"use client"

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ChevronRight, FileText, ArrowLeft, Search } from 'lucide-react';
import { ChatbotWidget } from '@/components/chatbot-widget';
import type { FilePost } from '@/lib/posts';

type BlogIndexClientProps = {
  posts: FilePost[];
};

const getCardImageUrl = (content: string, imageUrl?: string) => {
  if (imageUrl) return imageUrl;

  const markdownImageMatch = content.match(/!\[[^\]]*\]\(([^)\s]+)[^)]*\)/);
  if (markdownImageMatch?.[1]) return markdownImageMatch[1];

  const htmlImageMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return htmlImageMatch?.[1] || null;
};

export default function BlogIndexClient({ posts }: BlogIndexClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;

    const queryTerms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

    return posts.filter((post) => {
      const dateStr = new Date(post.date)
        .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        .toLowerCase();

      const searchableText = [post.title, post.tags, post.excerpt, post.content, dateStr]
        .join(' ')
        .toLowerCase();

      return queryTerms.every((term) => searchableText.includes(term));
    });
  }, [searchQuery, posts]);

  return (
    <div className="min-h-screen bg-black pt-8 md:pt-32 pb-20 relative px-4">
      <div className="fixed inset-0 bg-[#39ff14]/5 cyber-grid pointer-events-none z-0" />
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-[#39ff14]/5 to-transparent pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-16 border-b border-[#39ff14]/20 pb-8">
          <Link href="/" className="inline-flex items-center text-[#39ff14] hover:text-white font-mono text-sm tracking-widest mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" /> BACK TO HOME
          </Link>
          <h1 className="text-5xl md:text-7xl font-headline font-black text-white tracking-tighter uppercase mb-4 flex items-center gap-4">
            <FileText className="w-12 h-12 text-[#39ff14]" /> RESEARCH LOGS
          </h1>
          <p className="text-xl font-mono text-[#39ff14] opacity-80 pl-16">
            Personal notes, technical deep-dives, and academic archives.
          </p>
        </header>

        <div className="mb-12 relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#39ff14]/50" />
          </div>
          <input
            type="text"
            placeholder="SEARCH ARCHIVES BY TITLE, TAGS, OR DATE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 backdrop-blur border border-[#39ff14]/30 text-white placeholder-gray-500 rounded-xl py-4 pl-14 pr-6 focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all font-mono text-sm tracking-widest uppercase shadow-[0_0_15px_rgba(57,255,20,0.05)]"
          />
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center p-20 border border-dashed border-[#39ff14]/30 rounded-2xl bg-black/50 backdrop-blur">
            <p className="font-mono text-gray-500 uppercase tracking-widest">[ NO MATCHING RECORDS FOUND ]</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {filteredPosts.map((post) => {
              const cardImageUrl = getCardImageUrl(post.content, post.imageUrl);

              return (
                <Link
                  href={`/blog/${post.id}`}
                  key={post.id}
                  className="group block bg-black/60 backdrop-blur border border-[#39ff14]/20 rounded-xl overflow-hidden hover:border-[#39ff14] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(57,255,20,0.1)]"
                >
                  {cardImageUrl && (
                    <div className="relative h-52 w-full border-b border-[#39ff14]/20">
                      <Image src={cardImageUrl} alt={post.title} fill className="object-cover" unoptimized />
                    </div>
                  )}

                  <div className="p-8">
                    <div className="flex items-center gap-3 text-[#39ff14] font-mono text-xs mb-4 uppercase tracking-widest">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      {post.tags && (
                        <>
                          <span className="text-gray-600">|</span>
                          <span className="text-gray-400">{post.tags}</span>
                        </>
                      )}
                    </div>

                    <h2 className="text-3xl font-bold font-headline text-white mb-4 group-hover:text-[#39ff14] transition-colors leading-tight">
                      {post.title}
                    </h2>

                    <p className="text-gray-400 font-body text-lg leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>

                    <div className="flex items-center text-[#39ff14] font-mono text-sm tracking-widest group-hover:underline">
                      ACCESS LOG <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <ChatbotWidget />
    </div>
  );
}
