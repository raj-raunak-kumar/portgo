import React from 'react';
import { motion } from 'framer-motion';
import { Server, Code, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type IconName = "Code" | "Globe" | "Server";

const icons: Record<IconName, LucideIcon> = {
    Code,
    Globe,
    Server,
};

type TechCardProps = {
    title: string;
    items: string[];
    iconName: IconName;
    description?: string;
    delay?: number;
};

const TechCard = ({ title, items, iconName, description, delay = 0 }: TechCardProps) => {
    const Icon = icons[iconName];
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
            className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-8 aspect-square flex flex-col justify-center rounded-2xl hover:border-primary transition-all group duration-300 hover:shadow-[0_0_16px_rgba(96,165,250,0.12)] transform hover:-translate-y-1"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded bg-primary/10 text-primary">
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-headline font-bold text-xl tracking-wider">{title}</h3>
            </div>
            {description && <p className="text-gray-400 text-sm mb-6 leading-relaxed bg-clip-text font-medium">{description}</p>}
            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <span key={item} className="px-3 py-1 text-sm border border-white/20 rounded-full text-gray-300 hover:text-primary hover:border-primary transition-colors cursor-default">
                        {item}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}

export default TechCard;
