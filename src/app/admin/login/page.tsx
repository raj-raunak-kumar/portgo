"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Terminal, Shield, Lock } from 'lucide-react';
import { THEME } from '@/lib/constants';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({
                title: "Access Granted",
                description: "Initializing Krythos Admin Protocol...",
                className: "bg-black border-[#39ff14] text-[#39ff14]",
            });
            router.push('/admin/dashboard');
        } catch (error: any) {
            console.error("Login error:", error);
            toast({
                title: "Access Denied",
                description: error.message || "Invalid credentials. Unauthorized access detected.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative p-4 bg-black">
            {/* Background elements */}
            <div className="fixed inset-0 bg-[#39ff14]/5 cyber-grid z-0" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,#003300_0%,#000000_100%)] opacity-40 z-0" />

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-black/80 backdrop-blur-xl border border-[#39ff14]/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(57,255,20,0.1)] relative overflow-hidden">
                    {/* Top scanning line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#39ff14] animate-pulse shadow-[0_0_10px_#39ff14]" />

                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-full border-2 border-[#39ff14] flex items-center justify-center mb-4 bg-black shadow-[0_0_15px_rgba(57,255,20,0.4)] relative">
                            <Shield className="w-8 h-8 text-[#39ff14]" />
                            <div className="absolute inset-2 rounded-full border border-[#39ff14]/30 animate-[spin_3s_linear_infinite]" />
                        </div>
                        <h1 className="text-3xl font-bold font-headline tracking-widest text-white uppercase text-center relative flex flex-col">
                            KRYTHOS
                            <span className="text-sm font-mono text-[#39ff14] tracking-[0.3em] font-normal mt-1">
                                ADMIN PROTOCOL
                            </span>
                        </h1>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2 relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#39ff14] transition-colors">
                                <Terminal className="w-4 h-4" />
                            </div>
                            <Input
                                type="email"
                                placeholder="Admin ID (Email)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 bg-black/50 border-white/10 focus:border-[#39ff14] text-white font-mono placeholder:text-gray-600 h-12"
                                required
                            />
                        </div>

                        <div className="space-y-2 relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#39ff14] transition-colors">
                                <Lock className="w-4 h-4" />
                            </div>
                            <Input
                                type="password"
                                placeholder="Passcode"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 bg-black/50 border-white/10 focus:border-[#39ff14] text-white font-mono placeholder:text-gray-600 h-12"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-[#39ff14] hover:bg-[#39ff14]/80 text-black font-bold font-mono tracking-widest relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        AUTHENTICATING...
                                    </>
                                ) : (
                                    "> INITIATE LOGIN"
                                )}
                            </span>
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-xs font-mono">
                            RESTRICTED ACCESS // LEVEL 10 CLEARANCE ONLY
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
