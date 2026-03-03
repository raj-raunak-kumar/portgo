"use client";
import React, { useState } from 'react';
import SectionWrapper from '@/components/section-wrapper';
import { ALIENS } from '@/lib/constants';
import TechCard from '@/components/tech-card';
import ProjectModal from '@/components/project-modal';
import { motion } from 'framer-motion';
import { Database, Terminal, Globe, Github, Cpu } from 'lucide-react';

type Project = {
    icon: React.ElementType,
    title: string,
    description: string,
    longDescription: string,
    tags: string[],
    ghLink?: string
};

const ProjectCard = ({ project, onClick, index = 0 }: { project: Project, onClick: () => void, index?: number }) => {
    const Icon = project.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
            onClick={onClick}
            className="group relative overflow-hidden flex flex-col justify-center rounded-2xl bg-slate-900/70 border border-white/10 hover:border-primary transition-all duration-300 hover:shadow-[0_0_16px_rgba(96,165,250,0.2)] transform hover:-translate-y-1 cursor-pointer min-h-[210px] sm:min-h-[240px] md:aspect-square"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="p-5 sm:p-6 md:p-8 relative z-10">
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <Icon className="text-xl sm:text-2xl text-primary" />
                    {project.ghLink && <a href={project.ghLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><Github className="text-gray-500 hover:text-white cursor-pointer text-xl" /></a>}
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">{project.title}</h4>
                <p className="text-gray-400 mb-4 sm:mb-6 text-sm leading-relaxed">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-primary">
                    {project.tags.map(tag => <span key={tag}>{tag}</span>)}
                </div>
            </div>
        </motion.div>
    );
}

const TechSection = () => {
    const modeColor = '#60a5fa';
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const projects: Project[] = [
        {
            icon: Database,
            title: "Database Engine from Scratch (Go)",
            description: "Implemented a relational database featuring a copy-on-write B-Tree key-value store.",
            longDescription: "A fully-featured relational database built from the ground up in Go. It includes a custom SQL-like query language parser and executor, supports concurrent transactions with isolation levels, and uses a copy-on-write B-Tree for efficient and durable key-value storage. This project demonstrates a deep understanding of database internals, data structures, and concurrency control.",
            tags: ["GO", "B-TREES", "CONCURRENCY", "DATABASES"],
            ghLink: "https://github.com/RajRaunak"
        },
        {
            icon: Terminal,
            title: "x64 Compiler",
            description: "A custom bytecode compiler translating a toy language into raw x64 assembly.",
            longDescription: "This compiler takes a high-level, C-like toy language and performs lexical analysis, parsing, semantic analysis, and code generation to produce optimized x64 assembly code. It demonstrates a comprehensive understanding of compiler architecture, instruction set architectures, and low-level system programming.",
            tags: ["C++", "ASSEMBLY", "COMPILER DESIGN", "SYSTEMS"],
            ghLink: "https://github.com/RajRaunak"
        },
        {
            icon: Globe,
            title: "BitTorrent Client",
            description: "Built from scratch using Python socket programming. Implements the peer wire protocol.",
            longDescription: "A command-line BitTorrent client created purely with Python's socket library. It correctly parses torrent files, communicates with trackers to find peers, and implements the peer wire protocol for downloading and sharing file pieces. This project showcases strong knowledge of networking protocols and low-level data manipulation.",
            tags: ["PYTHON", "NETWORKING", "SOCKETS", "P2P"],
            ghLink: "https://github.com/RajRaunak"
        }
    ];

    return (
        <>
            <SectionWrapper title="Technical Work" subtitle="Systems and Engineering Expertise" color={ALIENS.TECH_SKILLS.color}>
                <div className="space-y-8 sm:space-y-10 md:space-y-12 pt-2 sm:pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                        <TechCard
                            title="Languages"
                            iconName="Code"
                            items={['C', 'C++', 'Go', 'Rust', 'Python', 'Java', 'Assembly', 'Shell']}
                            delay={0.1}
                        />
                        <TechCard
                            title="Full Stack"
                            iconName="Globe"
                            items={['React', 'Node.js', 'MongoDB', 'MySQL', 'Web3', 'Tailwind']}
                            delay={0.2}
                        />
                        <TechCard
                            title="Core Systems"
                            iconName="Server"
                            items={['OS Design', 'Compilers', 'Distributed Systems', 'Linux Admin', 'Optimization']}
                            delay={0.3}
                        />
                    </div>

                    <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-5 sm:mb-8 flex items-center gap-3">
                            <Cpu style={{ color: modeColor }} /> Selected Projects
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                            {projects.map((p, i) => <ProjectCard key={i} project={p} onClick={() => setSelectedProject(p)} index={i} />)}
                        </div>
                    </div>
                </div>
            </SectionWrapper>
            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </>
    );
};

export default TechSection;
