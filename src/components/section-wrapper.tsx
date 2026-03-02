import React from 'react';
import { THEME } from '@/lib/constants';

type SectionWrapperProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  color?: string;
};

const SectionWrapper = ({ children, title, subtitle, color = THEME.green }: SectionWrapperProps) => (
  <div className="max-w-6xl mx-auto px-4 py-8 relative z-10 animate-fadeIn">
    <div className="mb-10 border-b border-white/15 pb-5">
      <h2 className="flex flex-col gap-2 md:gap-4">
        <span className="text-4xl md:text-5xl font-bold text-white tracking-tight font-headline">
          {title}
        </span>
        <span className="text-lg md:text-xl md:opacity-90 transition-all font-medium" style={{ color }}>
          {subtitle}
        </span>
      </h2>
    </div>
    {children}
  </div>
);

export default SectionWrapper;
