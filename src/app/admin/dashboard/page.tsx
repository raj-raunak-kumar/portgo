"use client"

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, LogOut, Check, X, ShieldAlert, Mail, MailOpen } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ChatbotWidget } from '@/components/chatbot-widget';
import { ContactMessage } from '@/lib/types';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false }) as any;

type BlogPost = {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    date: string;
    tags: string;
};

export default function AdminDashboard() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Tab State
    const [activeTab, setActiveTab] = useState<'BLOG' | 'INBOX'>('BLOG');
    const [messages, setMessages] = useState<ContactMessage[]>([]);

    // Form State
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tags, setTags] = useState('');

    const quillRef = useRef<any>(null);

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            if (input !== null && input.files !== null) {
                const file = input.files[0];
                if (file) {
                    try {
                        toast({ title: "Uploading Image", description: "Please wait... allocating storage." });
                        const storageRef = ref(storage, `blog-images/${Date.now()}-${file.name}`);
                        const snapshot = await uploadBytes(storageRef, file);
                        const downloadURL = await getDownloadURL(snapshot.ref);

                        const quill = quillRef.current?.getEditor();
                        if (quill) {
                            const range = quill.getSelection(true);
                            quill.insertEmbed(range.index, 'image', downloadURL);
                            quill.setSelection(range.index + 1);
                        }
                        toast({ title: "Success", description: "Image synced to Firebase.", className: "bg-black border-[#39ff14] text-[#39ff14]" });
                    } catch (error) {
                        console.error("Image upload failed", error);
                        toast({ title: "Upload Error", description: "Failed to upload image.", variant: "destructive" });
                    }
                }
            }
        };
    }, [toast]);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image', 'video'],
                ['clean'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['code-block']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), [imageHandler]);

    // Protect Route
    useEffect(() => {
        if (!loading && !user) {
            router.push('/admin/login');
        }
    }, [user, loading, router]);

    // Fetch Posts
    const fetchPosts = useCallback(async () => {
        try {
            setFetchError(null);

            // Set 5-second timeout for hung Database connections (due to missing rules)
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Connection to the server timed out. Check permission rules.")), 5000);
            });

            const querySnapshot = await Promise.race([
                getDocs(collection(db, "blogs")),
                timeoutPromise
            ]) as any;

            const postsData = querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as BlogPost));
            // Sort by date descending (simple string sort for YYYY-MM-DD or ISO)
            setPosts(postsData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (error: any) {
            console.error("Fetch Error:", error);
            setFetchError(error.message || "Failed to fetch database records.");
            toast({ title: "Database Error", description: "Failed to sync with Firebase.", variant: "destructive" });
        }
    }, [toast]);

    const fetchMessages = useCallback(async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "messages"));
            const messagesData = querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as ContactMessage));
            setMessages(messagesData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        } catch (error) {
            console.error("Fetch Messages Error:", error);
            toast({ title: "Inbox Sync Failed", description: "Could not retrieve transmissions.", variant: "destructive" });
        }
    }, [toast]);

    useEffect(() => {
        if (user) {
            fetchPosts();
            fetchMessages();
        }
    }, [user, fetchMessages, fetchPosts]);

    const handleLogout = async () => {
        await logout();
        router.push('/admin/login');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) {
            toast({ title: "Validation Error", description: "Title and Content are required.", variant: "destructive" });
            return;
        }

        try {
            const postData = {
                title,
                excerpt,
                content,
                imageUrl,
                tags,
                date: new Date().toISOString(),
            };

            if (isEditing && currentId) {
                await updateDoc(doc(db, "blogs", currentId), postData);
                toast({ title: "Protocol Updated", description: "Blog post successfully modified." });
            } else {
                await addDoc(collection(db, "blogs"), postData);
                toast({ title: "Protocol Initiated", description: "New blog post published successfully.", className: "bg-black border-[#39ff14] text-[#39ff14]" });
            }

            resetForm();
            fetchPosts();
        } catch (error: any) {
            console.error("Save error:", error);
            toast({ title: "System Error", description: "Failed to save the blog post.", variant: "destructive" });
        }
    };

    const handleEdit = (post: BlogPost) => {
        setTitle(post.title);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setImageUrl(post.imageUrl);
        setTags(post.tags);
        setCurrentId(post.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this record?")) return;

        try {
            await deleteDoc(doc(db, "blogs", id));
            toast({ title: "Record Deleted", description: "Blog post removed from the database." });
            fetchPosts();
        } catch (error) {
            console.error("Delete error:", error);
            toast({ title: "System Error", description: "Failed to delete the blog post.", variant: "destructive" });
        }
    };

    const resetForm = () => {
        setTitle('');
        setExcerpt('');
        setContent('');
        setImageUrl('');
        setTags('');
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleToggleRead = async (msg: ContactMessage) => {
        try {
            await updateDoc(doc(db, "messages", msg.id), { isRead: !msg.isRead });
            setMessages(messages.map(m => m.id === msg.id ? { ...m, isRead: !m.isRead } : m));
        } catch (error) {
            toast({ title: "Update Failed", description: "Could not sync document state.", variant: "destructive" });
        }
    };

    const handleDeleteMessage = async (id: string) => {
        if (!confirm("Permanently purge this transmission?")) return;
        try {
            await deleteDoc(doc(db, "messages", id));
            toast({ title: "Record Purged", description: "Transmission permanently deleted." });
            setMessages(messages.filter(m => m.id !== id));
        } catch (error) {
            toast({ title: "Delete Failed", description: "Could not remove transmission.", variant: "destructive" });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-[#39ff14] font-mono">
                <div className="animate-spin w-8 h-8 flex border-2 border-t-[#39ff14] border-black rounded-full mr-3" />
                INITIALIZING SECURE CONNECTION...
            </div>
        );
    }

    if (!user) return null; // Let the useEffect redirect

    return (
        <div className="min-h-screen bg-black text-white font-body p-8 relative">
            <div className="fixed inset-0 bg-[#39ff14]/5 cyber-grid pointer-events-none z-0" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="flex justify-between items-center mb-12 border-b border-[#39ff14]/30 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#39ff14]/10 rounded border border-[#39ff14]/30">
                            <ShieldAlert className="text-[#39ff14] w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-headline font-bold uppercase tracking-widest text-[#39ff14] flex items-center gap-2">
                                Krythos Command
                            </h1>
                            <p className="text-sm font-mono text-gray-400 mt-1">
                                Authorized User: {user.email}
                            </p>
                        </div>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14] hover:text-black font-mono">
                        <LogOut className="w-4 h-4 mr-2" /> DISCONNECT
                    </Button>
                </header>

                <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setActiveTab('BLOG')}
                        className={`px-6 py-2 font-mono tracking-widest text-sm rounded transition-all ${activeTab === 'BLOG' ? 'bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/50' : 'text-gray-500 hover:text-white'}`}
                    >
                        BLOG PROTOCOLS
                    </button>
                    <button
                        onClick={() => setActiveTab('INBOX')}
                        className={`px-6 py-2 font-mono tracking-widest text-sm rounded transition-all flex items-center gap-2 ${activeTab === 'INBOX' ? 'bg-[#ffaa00]/20 text-[#ffaa00] border border-[#ffaa00]/50' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Mail className="w-4 h-4" /> SECURE INBOX
                        {messages.filter(m => !m.isRead).length > 0 && (
                            <span className="bg-[#ffaa00] text-black px-2 py-0.5 rounded-full text-xs font-bold">
                                {messages.filter(m => !m.isRead).length}
                            </span>
                        )}
                    </button>
                </div>

                {activeTab === 'BLOG' ? (
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Editor Section */}
                        <div className="bg-black/60 backdrop-blur border border-white/10 rounded-xl p-6 shadow-xl">
                            <h2 className="text-2xl font-headline font-bold mb-6 flex items-center text-[#00ccff]">
                                <Plus className="mr-2" /> {isEditing ? 'EDIT RECORD' : 'NEW PROTOCOL (BLOG)'}
                            </h2>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Title</label>
                                    <Input
                                        value={title} onChange={(e) => setTitle(e.target.value)} required
                                        className="bg-black/50 border-white/20 focus:border-[#00ccff] focus:ring-0 font-bold"
                                        placeholder="e.g. My First Research Paper"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Cover Image URL (Optional)</label>
                                    <Input
                                        value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                                        className="bg-black/50 border-white/20 focus:border-[#00ccff] focus:ring-0"
                                        placeholder="https://example.com/image.png"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Excerpt / Summary</label>
                                    <Textarea
                                        value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required rows={2}
                                        className="bg-black/50 border-white/20 focus:border-[#00ccff] focus:ring-0 resize-none"
                                        placeholder="A short summary for the blog list page..."
                                    />
                                </div>

                                <div className="space-y-2 text-white pb-12">
                                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Content</label>
                                    <div className="bg-white text-black rounded-lg overflow-hidden border border-white/20">
                                        <ReactQuill
                                            ref={quillRef}
                                            theme="snow"
                                            value={content}
                                            onChange={setContent}
                                            modules={modules}
                                            className="h-[500px] pb-12"
                                            placeholder="Write your fully formatted protocol here..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Tags (Comma Separated)</label>
                                    <Input
                                        value={tags} onChange={(e) => setTags(e.target.value)}
                                        className="bg-black/50 border-white/20 focus:border-[#00ccff] focus:ring-0"
                                        placeholder="AI, Research, System Design"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-white/10">
                                    <Button type="submit" className="flex-1 bg-[#00ccff] hover:bg-[#00ccff]/80 text-black font-bold font-mono">
                                        <Check className="w-4 h-4 mr-2" /> {isEditing ? "SAVE CHANGES" : "PUBLISH POST"}
                                    </Button>
                                    {isEditing && (
                                        <Button type="button" onClick={resetForm} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-mono">
                                            <X className="w-4 h-4 mr-2" /> CANCEL
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* List Section */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-headline font-bold mb-6 flex items-center text-[#ffaa00]">
                                <ShieldAlert className="mr-2 w-6 h-6 border p-1 border-[#ffaa00] rounded" /> DATABASE RECORDS ({posts.length})
                            </h2>

                            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                                {fetchError ? (
                                    <div className="text-center p-8 border border-dashed border-red-500/30 rounded-xl bg-red-500/10 text-red-500 font-mono">
                                        [ ERROR: {fetchError} ]<br />
                                        Please verify your Firestore Rules are correctly published.
                                    </div>
                                ) : posts.length === 0 ? (
                                    <div className="text-center p-12 border border-dashed border-white/20 rounded-xl text-gray-500 font-mono">
                                        NO RECORDS FOUND
                                    </div>
                                ) : (
                                    posts.map((post) => (
                                        <div key={post.id} className="bg-black/40 border border-white/10 rounded-lg p-5 hover:border-[#ffaa00]/50 transition-colors group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg text-white group-hover:text-[#ffaa00] transition-colors line-clamp-1">{post.title}</h3>
                                                <div className="flex gap-2 ml-4">
                                                    <button onClick={() => handleEdit(post)} className="p-2 bg-black hover:bg-[#00ccff]/20 text-gray-400 hover:text-[#00ccff] rounded border border-white/10 transition-colors">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(post.id)} className="p-2 bg-black hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded border border-white/10 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{post.excerpt}</p>
                                            <div className="flex justify-between items-center text-xs font-mono text-gray-600">
                                                <span>{new Date(post.date).toLocaleDateString()}</span>
                                                <span className="px-2 py-0.5 border border-white/10 rounded-full">{post.tags || "No Tags"}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {messages.length === 0 ? (
                            <div className="text-center p-12 border border-dashed border-white/20 rounded-xl text-gray-500 font-mono">
                                NO INCOMING TRANSMISSIONS
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`p-6 rounded-xl border transition-all ${msg.isRead ? 'bg-black/40 border-white/10 opacity-70' : 'bg-[#ffaa00]/10 border-[#ffaa00]/50 shadow-[0_0_15px_rgba(255,170,0,0.1)]'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                                                {!msg.isRead && <span className="w-2 h-2 rounded-full bg-[#ffaa00] animate-pulse"></span>}
                                                {msg.subject}
                                            </h3>
                                            <p className="font-mono text-sm text-[#00ccff]">{msg.email}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</span>
                                            <button onClick={() => handleToggleRead(msg)} className="p-2 bg-black hover:bg-white/10 text-gray-400 hover:text-white rounded border border-white/10 transition-colors" title={msg.isRead ? "Mark Unread" : "Mark Read"}>
                                                {msg.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                                            </button>
                                            <button onClick={() => handleDeleteMessage(msg.id)} className="p-2 bg-black hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded border border-white/10 transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Global AI Assistant for Admin Authoring Context */}
            <ChatbotWidget />
        </div>
    );
}
