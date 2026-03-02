import React from 'react';
import SectionWrapper from '@/components/section-wrapper';
import { ALIENS } from '@/lib/constants';
import { BookOpen, ShieldHalf, Trophy, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const AcademicsSection = () => {
    const modeColor = '#fbbf24';

    const motionProps = (delay: number) => ({
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.6, delay, type: "spring" as const, stiffness: 100 }
    });

    return (
        <SectionWrapper title="Academics" subtitle="Research, Publications, and Awards" color={ALIENS.ACADEMICS.color}>
            <div className="grid md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-6">
                    <motion.h3 {...motionProps(0.1)} className="text-2xl font-bold text-white flex items-center gap-3">
                        <BookOpen style={{ color: modeColor }} /> Selected Research
                    </motion.h3>
                    <motion.div {...motionProps(0.2)} className="bg-slate-900/60 border-l-4 p-6 rounded-sm hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(251,191,36,0.1)]" style={{ borderColor: modeColor }}>
                        <h4 className="text-xl font-bold text-white mb-2">Sentiment Analysis of Drug Reviews</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Comparative evaluation of transformer models (BERT, XLNet, BigBird) and classical machine learning methods on the UCI Drug Review dataset.
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs font-medium" style={{ color: modeColor }}>
                            <span>TRANSFORMERS</span>
                            <span>NLP</span>
                            <span>PYTHON</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-500">
                            Presented at the International Conference on Innovations in Science & Technology (2024–2025)
                        </div>
                    </motion.div>

                    <motion.h3 {...motionProps(0.3)} className="text-2xl font-bold text-white flex items-center gap-3 mt-8">
                        <ShieldHalf style={{ color: modeColor }} /> Achievements
                    </motion.h3>
                    <ul className="space-y-4">
                        <motion.li {...motionProps(0.4)} className="flex items-start gap-4 p-4 bg-slate-900/60 border border-white/10 rounded-sm hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 hover:border-amber-500/50">
                            <Trophy className="shrink-0 mt-1" style={{ color: modeColor }} />
                            <div>
                                <strong className="text-white block">UGC-NET JRF (Dec 2024)</strong>
                                <span className="text-gray-400 text-sm">99.97 percentile; qualified for JRF and Assistant Professor eligibility.</span>
                            </div>
                        </motion.li>
                        <motion.li {...motionProps(0.5)} className="flex items-start gap-4 p-4 bg-slate-900/60 border border-white/10 rounded-sm hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 hover:border-amber-500/50">
                            <Trophy className="shrink-0 mt-1" style={{ color: modeColor }} />
                            <div>
                                <strong className="text-white block">ACM Winter School 2024 Winner</strong>
                                <span className="text-gray-400 text-sm">Amrita University.</span>
                            </div>
                        </motion.li>
                    </ul>
                </div>

                <div className="space-y-8">
                    <motion.h3 {...motionProps(0.1)} className="text-2xl font-bold text-white flex items-center gap-3">
                        <Brain style={{ color: modeColor }} /> Education
                    </motion.h3>

                    <div className="flex flex-col gap-6">
                        <motion.div {...motionProps(0.15)} className="p-8 rounded-2xl border transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_10px_20px_rgba(255,170,0,0.1)] transform hover:-translate-y-1" style={{ backgroundColor: `${modeColor}1A`, borderColor: `${modeColor}33` }}>
                            <h4 className="text-xl font-bold text-white">PhD in Computer Science and Engineering, IIT Patna</h4>
                            <p className="font-mono text-sm mb-2" style={{ color: modeColor }}>2025 - Present</p>
                            <p className="text-gray-400 mt-2 mb-3 leading-relaxed">Current focus: systems-level AI, robust model deployment, and scalable machine learning.</p>
                        </motion.div>

                        <motion.div {...motionProps(0.2)} className="p-8 rounded-2xl border transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_10px_20px_rgba(255,170,0,0.1)] transform hover:-translate-y-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderColor: `${modeColor}33` }}>
                            <h4 className="text-xl font-bold text-white mb-2">M.Sc. in Computer Science, MIT Manipal – IMSc Chennai</h4>
                            <p className="font-mono text-sm mb-2" style={{ color: modeColor }}>2023 - 2025</p>
                            <p className="text-gray-400 mt-2 mb-3 leading-relaxed">Joint program completed with GPA 9.03/10.</p>
                        </motion.div>

                        <motion.div {...motionProps(0.3)} className="p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.05)]">
                            <h4 className="text-xl font-bold text-white mb-2">B.Sc. (Hons) Computer Science</h4>
                            <p className="font-mono text-sm mb-2 text-gray-500">2020 - 2023</p>
                            <p className="text-gray-400 mt-2 mb-4 leading-relaxed">Deen Dayal Upadhyaya College</p>
                            <div className="inline-block self-start px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm">
                                GPA: 9.28 / 10 (College Topper)
                            </div>
                        </motion.div>

                        <motion.div {...motionProps(0.4)} className="p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.05)]">
                            <h4 className="text-xl font-bold text-white mb-2">Class 12th</h4>
                            <p className="font-mono text-sm mb-2 text-gray-500">2019</p>
                            <p className="text-gray-400 mt-2 mb-4 leading-relaxed">Kendriya Vidyalaya (Zonal Topper)</p>
                            <div className="inline-block self-start px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm">
                                92.8%
                            </div>
                        </motion.div>

                        <motion.div {...motionProps(0.5)} className="p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.05)]">
                            <h4 className="text-xl font-bold text-white mb-2">Class 10th</h4>
                            <p className="font-mono text-sm mb-2 text-gray-500">2017</p>
                            <p className="text-gray-400 mt-2 mb-4 leading-relaxed">Kendriya Vidyalaya, Chakradharpur (Topper)</p>
                            <div className="inline-block self-start px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm">
                                10 CGPA
                            </div>
                        </motion.div>
                    </div>

                    <motion.div {...motionProps(0.6)} className="p-8 rounded-2xl bg-gradient-to-br border mt-6" style={{
                        backgroundColor: `${modeColor}1A`,
                        borderColor: `${modeColor}33`,
                    }}>
                            <h4 className="font-bold mb-2 tracking-wide text-sm" style={{ color: modeColor }}>Research Interests</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Theoretical CS', 'Machine Learning', 'Distributed Systems', 'Compilers'].map(tag => (
                                <span key={tag} className="px-2 py-1 bg-black/50 text-white text-xs rounded border" style={{ borderColor: `${modeColor}4D` }}>{tag}</span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default AcademicsSection;
