import React from 'react';
import { THEME } from '@/lib/constants';

type SectionWrapperProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  color?: string;
};

const SectionWrapper = ({ children, title, subtitle, color = THEME.green }: SectionWrapperProps) => (
  <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-5 sm:py-6 md:py-8 relative z-10 animate-fadeIn">
    <div className="mb-6 sm:mb-7 md:mb-10 border-b border-white/15 pb-3 sm:pb-4 md:pb-5">
      <h2 className="flex flex-col gap-2 md:gap-4">
        <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight font-headline">
          {title}
        </span>
        <span className="text-sm sm:text-base md:text-xl md:opacity-90 transition-all font-medium" style={{ color }}>
          {subtitle}
        </span>
      </h2>
    </div>
    {children}
  </div>
);

export default SectionWrapper;
