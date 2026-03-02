import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

type HeroSectionProps = {
  onTransformClick: () => void;
}

const HeroSection = ({ onTransformClick }: HeroSectionProps) => {
  return (
    <div className="h-full flex flex-col justify-start text-center px-4 pt-20 md:pt-[16vh] relative z-10 animate-fadeIn">
      <div className="max-w-4xl mx-auto rounded-2xl border border-white/15 bg-slate-900/50 backdrop-blur-sm p-8 md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-primary/90 mb-5">Systems AI Research · IIT Patna</p>
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4 font-headline">
        RAJ RAUNAK KUMAR
        </h1>
        <p className="text-lg md:text-2xl font-medium text-slate-200 max-w-3xl mx-auto leading-relaxed">
          PhD Scholar in Computer Science and Engineering, IIT Patna. I work on systems-oriented AI and scalable machine learning.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onTransformClick}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
          >
            Explore Sections <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="/blog"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-white/20 text-slate-100 hover:bg-white/5 transition"
          >
            Publications & Notes <BookOpen className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
