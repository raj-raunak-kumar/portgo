"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalMenuButton() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <div className="fixed top-5 right-4 z-[60]">
      <Link
        href="/"
        className="px-4 py-2 bg-slate-900/80 backdrop-blur border border-white/25 text-white rounded-md hover:bg-slate-900 hover:border-primary transition-all font-semibold tracking-[0.08em] text-[11px] uppercase"
      >
        Menu
      </Link>
    </div>
  );
}
