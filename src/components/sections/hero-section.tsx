import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import Omnitrix3D from '@/components/omnitrix-3d';

type HeroSectionProps = {
  onTransformClick: () => void;
}

const HeroSection = ({ onTransformClick }: HeroSectionProps) => {
  return (
    <div className="w-full flex items-center justify-center text-center px-3 sm:px-4 pt-2 md:pt-20 pb-8 md:pb-10 relative z-10 animate-fadeIn">
      <div className="relative w-full max-w-[94vw] md:max-w-4xl mx-auto rounded-2xl border border-white/10 bg-slate-900/45 backdrop-blur-sm p-5 sm:p-7 md:p-12 shadow-[0_24px_80px_rgba(2,6,23,0.45)] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.18),transparent_58%)]" />
        <div className="mb-2 sm:mb-3 md:mb-4 flex justify-center relative z-10">
          <Omnitrix3D color="#60a5fa" className="w-36 h-36 sm:w-44 sm:h-44 md:w-64 md:h-64" />
        </div>
        <p className="text-[10px] md:text-xs uppercase tracking-[0.26em] sm:tracking-[0.38em] text-primary/90 mb-4 sm:mb-5 relative z-10">Systems AI Research · IIT Patna</p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-[0.95] mb-3 sm:mb-4 font-headline relative z-10">
          RAJ RAUNAK KUMAR
        </h1>
        <p className="text-sm sm:text-base md:text-2xl font-medium text-slate-200/95 max-w-3xl mx-auto leading-relaxed relative z-10">
          PhD Scholar in Computer Science and Engineering, IIT Patna. I work on systems-oriented AI and scalable machine learning.
        </p>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center relative z-10">
          <button
            onClick={onTransformClick}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-[0_8px_24px_rgba(96,165,250,0.35)]"
          >
            Explore Sections <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="/blog"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-white/20 text-slate-100 hover:bg-white/5 transition"
          >
            Publications & Notes <BookOpen className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
