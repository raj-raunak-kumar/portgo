"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { BlogPost } from '@/lib/types';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

export default function BlogPostPage() {
    const { id } = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchPost = async () => {
            try {
                const docRef = doc(db, "blogs", id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Error fetching document:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center font-mono text-[#39ff14]">
                <div className="animate-spin w-8 h-8 flex border-2 border-t-[#39ff14] border-black rounded-full mr-3" />
                DECRYPTING FILE...
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-red-500">
                <h1 className="text-4xl font-headline font-bold mb-4">ERROR 404</h1>
                <p className="mb-8">FILE CORRUPTED OR NOT FOUND</p>
                <Link href="/blog" className="px-6 py-3 border border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14] hover:text-black transition-colors rounded">
                    {'< RETURN TO ARCHIVES'}
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-8 md:pt-32 pb-20 relative px-4">
            {/* Background Elements */}
            <div className="fixed inset-0 bg-[#39ff14]/5 cyber-grid pointer-events-none z-0" />

            <article className="max-w-3xl mx-auto relative z-10 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Cover Image */}
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
                        <h1 className="text-4xl md:text-6xl font-headline font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-gray-400 font-mono text-sm">
                            <span className="flex items-center text-[#39ff14]">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            {post.tags && (
                                <span className="flex items-center text-[#00ccff]">
                                    <Tag className="w-4 h-4 mr-2" />
                                    {post.tags.split(',').map(t => t.trim()).join(' / ')}
                                </span>
                            )}
                        </div>
                    </header>

                    <div className="prose prose-invert prose-lg max-w-none 
                          prose-headings:font-headline prose-headings:font-bold prose-headings:text-white
                          prose-p:font-body prose-p:text-gray-300 prose-p:leading-relaxed
                          prose-a:text-[#39ff14] prose-a:no-underline hover:prose-a:underline
                          prose-code:text-[#ffaa00] prose-code:bg-black/50 prose-code:p-1 prose-code:rounded prose-code:font-mono
                          prose-pre:bg-[#050505] prose-pre:border prose-pre:border-white/10 prose-pre:p-4
                          prose-img:rounded-xl prose-img:border prose-img:border-white/10"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>
        </div>
    );
}
