
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Github } from 'lucide-react';

type Project = {
    icon: React.ElementType;
    title: string;
    description: string;
    longDescription: string;
    tags: string[];
    ghLink?: string;
};

type ProjectModalProps = {
    project: Project | null;
    onClose: () => void;
};

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
    if (!project) return null;
    const Icon = project.icon;

    return (
        <Dialog open={!!project} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900/95 border-primary/40 text-gray-200 font-sans max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-4 text-2xl font-headline text-primary mb-2">
                        <Icon className="text-2xl" />
                        {project.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 pt-4 border-t border-white/10">
                        {project.longDescription}
                    </DialogDescription>
                </DialogHeader>
                <div className="pt-4">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 text-xs border border-primary/50 rounded-full text-primary font-mono">
                                {tag}
                            </span>
                        ))}
                    </div>
                    {project.ghLink && (
                         <a 
                            href={project.ghLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded hover:bg-primary hover:text-primary-foreground transition-all font-semibold text-sm"
                        >
                            <Github /> View on GitHub
                        </a>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectModal;
