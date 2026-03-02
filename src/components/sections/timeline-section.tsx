import React from 'react';
import SectionWrapper from '@/components/section-wrapper';
import { ALIENS } from '@/lib/constants';

import { motion } from 'framer-motion';

const TimelineSection = () => {
    const modeColor = '#00ccff';

    const timelineItems = [
        { year: '2025', title: 'PhD Scholar, IIT Patna', desc: 'Research focus: systems-level AI and scalable learning systems.', side: 'left' },
        { year: '2024', title: 'UGC-NET JRF', desc: 'Qualified with 99.97 percentile and Assistant Professor eligibility.', side: 'right' },
        { year: '2023-2025', title: 'M.Sc. Computer Science, MIT Manipal – IMSc Chennai', desc: 'Joint program completed with GPA 9.03/10.', side: 'left' },
        { year: '2020-2023', title: 'B.Sc. (Hons) Computer Science', desc: 'Graduated from Deen Dayal Upadhyaya College as College Topper (9.28 GPA).', side: 'right' },
        { year: '2019', title: 'Class 12th', desc: 'Kendriya Vidyalaya, Zonal Topper (92.8%).', side: 'left' },
        { year: '2017', title: 'Class 10th', desc: 'Kendriya Vidyalaya, Chakradharpur Topper (10 CGPA).', side: 'right' }
    ];

    return (
        <SectionWrapper title="Timeline" subtitle="Academic Journey" color={ALIENS.TIMELINE.color}>
            <div className="relative py-10 overflow-hidden">
                <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-gradient-to-b from-[#22d3ee] to-transparent"></div>

                {timelineItems.map((item, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
                        key={index}
                        className={`flex items-center w-full mb-12 flex-row ${item.side === 'right' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className="w-5/12"></div>
                        <div className="w-2/12 flex justify-center relative">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: modeColor }}></div>
                        </div>
                        <div className={`w-5/12 flex items-center ${item.side === 'left' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`p-4 md:p-6 bg-slate-900/60 border rounded-2xl hover:bg-opacity-10 transition-all duration-300 w-full max-w-[260px] transform hover:scale-[1.02] hover:shadow-[0_0_14px_rgba(34,211,238,0.15)] aspect-square flex flex-col justify-center ${item.side === 'left' ? 'text-right items-end' : 'text-left items-start'}`} style={{ borderColor: `${modeColor}4D`, background: `rgba(34, 211, 238, 0.05)` }}>
                                <h3 className="text-sm md:text-xl font-bold font-mono mb-1" style={{ color: modeColor }}>{item.year}</h3>
                                <h4 className="text-white text-xs md:text-base font-bold mb-1 md:mb-2 leading-snug">{item.title}</h4>
                                <p className="text-gray-400 text-[9px] md:text-xs mt-1 md:mt-2 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default TimelineSection;
