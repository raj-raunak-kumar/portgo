"use client";

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ALIENS, Alien } from '@/lib/constants';
import HeroSection from '@/components/sections/hero-section';

const EnergyBackground = dynamic(() => import('@/components/energy-background'), { ssr: false });
const ChatbotWidget = dynamic(
  () => import('@/components/chatbot-widget').then((module) => module.ChatbotWidget),
  { ssr: false }
);
const AcademicsSection = dynamic(() => import('@/components/sections/academics-section'));
const TechSection = dynamic(() => import('@/components/sections/tech-section'));
const TimelineSection = dynamic(() => import('@/components/sections/timeline-section'));
const ContactSection = dynamic(() => import('@/components/sections/contact-section'));

export default function HomePageClient() {
  const [mode, setMode] = useState<Alien>(ALIENS.HUMAN);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const currentUrl = new URL(window.location.href);
    const sectionId = currentUrl.searchParams.get('section');
    const targetMode = sectionId ? Object.values(ALIENS).find((alien) => alien.id === sectionId) : null;

    if (targetMode) {
      setMode(targetMode);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentUrl.searchParams.get('menu') === '1') {
      setIsMenuOpen(true);
    }

    if (!targetMode && currentUrl.searchParams.get('menu') !== '1') return;

    currentUrl.searchParams.delete('section');
    currentUrl.searchParams.delete('menu');
    const normalizedPath = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
    window.history.replaceState({}, '', normalizedPath || '/');
  }, [isMounted]);

  const handleModeChange = (newMode: Alien) => {
    if (newMode.id === mode.id && newMode.id !== 'HUMAN') {
      setIsMenuOpen(false);
      return;
    }
    setIsMenuOpen(false);
    setMode(newMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (mode.id) {
      case 'ACADEMICS':
        return <AcademicsSection />;
      case 'TECH_SKILLS':
        return <TechSection />;
      case 'TIMELINE':
        return <TimelineSection />;
      case 'CONTACT':
        return <ContactSection />;
      default:
        return <HeroSection onTransformClick={() => setIsMenuOpen(true)} />;
    }
  };

  const showHeader = mode.id !== 'HUMAN';
  const CurrentIcon = mode.icon;
  const isHero = mode.id === 'HUMAN';

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground font-sans">
      <EnergyBackground activeColor={mode.color} />

      {showHeader ? (
        <div className="absolute top-0 left-0 w-full p-6 hidden md:flex justify-between items-center z-50 pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-slate-900/70 backdrop-blur pointer-events-auto">
              <CurrentIcon className="text-lg" style={{ color: mode.color }} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 tracking-widest pointer-events-auto">CURRENT SECTION</span>
              <span className="font-headline font-semibold tracking-wide text-lg pointer-events-auto" style={{ color: mode.color }}>
                {mode.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="pointer-events-auto px-5 py-2 bg-slate-900/70 backdrop-blur border border-primary/50 text-primary rounded-md hover:bg-slate-900 transition-all font-semibold tracking-wide text-sm"
            >
              Blog
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="pointer-events-auto px-5 py-2 bg-slate-900/70 backdrop-blur border border-white/20 text-white rounded-md hover:bg-slate-900 hover:border-primary transition-all font-semibold tracking-wide text-sm"
            >
              {isMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed top-0 left-0 w-full p-6 hidden md:flex justify-between items-center z-50 pointer-events-none">
          <div className="opacity-0 pointer-events-none" />
          {isMounted && mode.id === 'HUMAN' && (
            <div className="flex items-center gap-3">
              <Link
                href="/blog"
                className="pointer-events-auto px-4 py-2 bg-slate-900/70 backdrop-blur border border-primary/45 text-primary rounded-md hover:bg-slate-900 hover:border-primary/70 transition-all font-semibold tracking-[0.08em] text-[11px] uppercase animate-fadeIn"
                style={{ animationDelay: '0.3s' }}
              >
                Blog
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="pointer-events-auto px-4 py-2 bg-slate-900/70 backdrop-blur border border-white/25 text-white rounded-md hover:bg-slate-900 hover:border-primary transition-all font-semibold tracking-[0.08em] text-[11px] uppercase animate-fadeIn"
                style={{ animationDelay: '0.3s' }}
              >
                Main Menu
              </button>
            </div>
          )}
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-lg flex flex-col items-center justify-center md:justify-center animate-fadeIn overflow-y-auto py-20 md:py-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto p-4">
            {Object.values(ALIENS).map((alien) => {
              const Icon = alien.icon;
              return (
                <button
                  key={alien.id}
                  onClick={() => handleModeChange(alien)}
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
          <p className="mt-8 text-slate-400 text-sm">Select a section</p>
        </div>
      )}

      <div className="fixed top-4 right-3 z-40 md:hidden pointer-events-none">
        <Link
          href="/blog"
          className="pointer-events-auto px-3 py-1.5 bg-slate-900/80 backdrop-blur border border-primary/50 text-primary rounded-full hover:bg-slate-900 transition-all font-semibold tracking-wide text-[10px]"
        >
          Blog
        </Link>
      </div>

      <main ref={mainRef} className={`relative block ${isHero ? 'min-h-[100svh] pt-14 md:pt-24 pb-28 md:pb-10' : 'min-h-screen pt-8 md:pt-24 pb-24 md:pb-10'}`}>
        {isMounted && renderContent()}
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-[68px] bg-slate-950/95 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-2 z-50 md:hidden pb-[env(safe-area-inset-bottom)]">
        {Object.values(ALIENS).map((alien) => {
          const NavIcon = alien.icon;
          const isActive = mode.id === alien.id;
          return (
            <button
              key={alien.id}
              onClick={() => handleModeChange(alien)}
              className="flex flex-col items-center justify-center w-16 h-full transition-all duration-300 relative group"
            >
              <div
                className={`relative z-10 p-1.5 rounded-full transition-all duration-300 ${isActive ? 'scale-110 -translate-y-0.5' : 'group-hover:bg-white/5'}`}
                style={isActive ? { backgroundColor: `${alien.color}22`, color: alien.color } : { color: '#94a3b8' }}
              >
                <NavIcon className="text-xl" />
              </div>
              <span
                className={`text-[9px] font-semibold tracking-wide mt-1 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}
                style={isActive ? { color: alien.color } : { color: '#94a3b8' }}
              >
                {alien.id === 'HUMAN' ? 'Home' : alien.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      <ChatbotWidget />
    </div>
  );
}
