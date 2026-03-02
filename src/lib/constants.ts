import { HeartPulse, Brain, Cpu, Zap, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const THEME = {
    green: '#93c5fd',
    darkGreen: '#1e3a8a',
    black: '#0f172a',
    glass: 'rgba(148, 163, 184, 0.08)',
    glassBorder: 'rgba(148, 163, 184, 0.24)',
    text: '#e2e8f0'
};

export interface Alien {
    id: string;
    label: string;
    subtitle?: string;
    color: string;
    icon: LucideIcon;
}

export const ALIENS: { [key: string]: Alien } = {
    HUMAN: { id: 'HUMAN', label: 'HOME', subtitle: 'Research Overview', color: '#cbd5e1', icon: HeartPulse },
    ACADEMICS: { id: 'ACADEMICS', label: 'ACADEMICS', subtitle: 'Research, Publications, and Awards', color: '#fbbf24', icon: Brain },
    TECH_SKILLS: { id: 'TECH_SKILLS', label: 'TECHNICAL WORK', subtitle: 'Systems and Engineering Expertise', color: '#60a5fa', icon: Cpu },
    TIMELINE: { id: 'TIMELINE', label: 'TIMELINE', subtitle: 'Academic Journey', color: '#22d3ee', icon: Zap },
    CONTACT: { id: 'CONTACT', label: 'CONTACT', subtitle: 'Collaboration and Communication', color: '#f87171', icon: Mail }
};
