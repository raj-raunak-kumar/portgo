"use client";

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ALIENS, Alien } from '@/lib/constants';

export default function GlobalMenuButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (pathname === '/') {
    return null;
  }

  const handleModeSelect = (mode: Alien) => {
    setIsMenuOpen(false);

    if (mode.id === 'HUMAN') {
      router.push('/');
      return;
    }

    router.push(`/?section=${encodeURIComponent(mode.id)}`);
  };

  return (
    <>
      <div className="fixed top-5 right-4 z-[60]">
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="px-4 py-2 bg-slate-900/80 backdrop-blur border border-white/25 text-white rounded-md hover:bg-slate-900 hover:border-primary transition-all font-semibold tracking-[0.08em] text-[11px] uppercase"
        >
          Menu
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-lg flex flex-col items-center justify-center animate-fadeIn overflow-y-auto py-20"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto p-4"
            onClick={(event) => event.stopPropagation()}
          >
            {Object.values(ALIENS).map((alien) => {
              const Icon = alien.icon;

              return (
                <button
                  key={alien.id}
                  onClick={() => handleModeSelect(alien)}
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all duration-300"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: `${alien.color}24`, color: alien.color }}
                  >
                    <Icon className="text-xl" />
                  </div>
                  <span className="font-headline font-semibold tracking-wide text-sm text-slate-300 group-hover:text-white">
                    {alien.label}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-8 text-slate-400 text-sm">Click outside to close</p>
        </div>
      )}
    </>
  );
}
