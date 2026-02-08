'use client';

import { motion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/components/language-provider';
import { translations } from '@/data/translations';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { Briefcase, Calendar, MapPin, ArrowRight, TrendingUp } from 'lucide-react';

interface ExperienceItem {
    id: string;
    role: string;
    company: string;
    location: string;
    period: string;
    duration: string;
    description: readonly string[];
    technologies: readonly string[];
    achievements?: readonly string[];
    type: 'current' | 'past';
}

export function ExperienceSection() {
    const { language } = useLanguage();
    const t = translations[language];
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end 0.65"]
    });

    const experiences = t.experience.items as unknown as ExperienceItem[];

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="relative py-20 overflow-hidden"
        >
            {/* Decorative Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--primary-color)]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--secondary-color)]/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 mb-4"
                        >
                            <Briefcase className="w-4 h-4 text-[var(--primary-color)]" />
                            <span className="text-sm font-medium text-[var(--primary-color)]">
                                {t.experience.subtitle}
                            </span>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-neon">
                            {t.experience.title}
                        </h2>

                        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                            {t.experience.description}
                        </p>
                    </div>

                    {/* Timeline Container */}
                    <div className="max-w-6xl mx-auto relative">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--primary-color)]/20 via-[var(--primary-color)]/50 to-[var(--primary-color)]/20 -translate-x-1/2 hidden md:block" />

                        {/* Animated Progress Line */}
                        <motion.div
                            className="absolute left-8 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-[var(--primary-color)] to-[var(--secondary-color)] -translate-x-1/2 origin-top hidden md:block"
                            style={{
                                scaleY: scrollYProgress,
                                height: '100%',
                            }}
                        />

                        {/* Experience Items */}
                        <div className="space-y-12 md:space-y-16">
                            {experiences.map((exp, index) => (
                                <ExperienceCard
                                    key={exp.id}
                                    experience={exp}
                                    index={index}
                                    isLeft={index % 2 === 0}
                                    language={language}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mt-16"
                    >
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 text-[var(--primary-color)] font-medium hover:bg-[var(--primary-color)]/20 transition-all group"
                        >
                            <span>{language === 'pt' ? 'Vamos trabalhar juntos?' : "Let's work together?"}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

function ExperienceCard({
    experience,
    index,
    isLeft,
    language
}: {
    experience: ExperienceItem;
    index: number;
    isLeft: boolean;
    language: 'pt' | 'en';
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isCurrent = experience.type === 'current';

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
            }}
            viewport={{ once: false, margin: "-100px" }}
            className={`relative ${isLeft ? 'md:pr-[50%]' : 'md:pl-[50%]'}`}
        >
            {/* Timeline Node */}
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--primary-color)] z-10 top-8">
                {isCurrent && (
                    <>
                        <span className="absolute inset-0 rounded-full bg-[var(--primary-color)] animate-ping opacity-75" />
                        <span className="absolute inset-0 rounded-full bg-[var(--primary-color)]" />
                    </>
                )}
            </div>

            {/* Card */}
            <InteractiveCard className={`ml-16 md:ml-0 group hover:scale-[1.02] transition-transform ${isLeft ? 'md:mr-8' : 'md:ml-8'}`}>
                <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col items-start gap-3 mb-4">
                        {/* Status Badge */}
                        {isCurrent && (
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20"
                            >
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                    {language === 'pt' ? 'ATUAL' : 'CURRENT'}
                                </span>
                            </motion.div>
                        )}

                        {/* Role & Company */}
                        <div>
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--primary-color)] transition-colors">
                                {experience.role}
                            </h3>
                            <p className="text-lg font-semibold text-[var(--primary-color)] flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                {experience.company}
                            </p>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <Calendar className="w-4 h-4" />
                            <span>{experience.period}</span>
                            <span className="px-2 py-0.5 rounded bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xs font-medium">
                                {experience.duration}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <MapPin className="w-4 h-4" />
                            <span>{experience.location}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <ul className="space-y-2 mb-6">
                        {experience.description.map((desc, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                                viewport={{ once: true }}
                                className="text-[var(--text-secondary)] flex items-start gap-2"
                            >
                                <span className="text-[var(--primary-color)] mt-1.5 flex-shrink-0">•</span>
                                <span>{desc}</span>
                            </motion.li>
                        ))}
                    </ul>

                    {/* Achievements */}
                    {experience.achievements && experience.achievements.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4 text-[var(--primary-color)]" />
                                <span className="text-sm font-semibold text-[var(--text-primary)]">
                                    {language === 'pt' ? 'Conquistas' : 'Achievements'}
                                </span>
                            </div>
                            <ul className="space-y-1.5">
                                {experience.achievements.map((achievement, i) => (
                                    <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span>{achievement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, i) => (
                            <motion.span
                                key={tech}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.05 * i }}
                                viewport={{ once: true }}
                                className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] border border-[var(--primary-color)]/20 hover:bg-[var(--primary-color)]/20 transition-colors"
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* Decorative Corner Gradient */}
                <div className={`absolute ${isLeft ? 'top-0 right-0' : 'top-0 left-0'} w-24 h-24 bg-gradient-to-br from-[var(--primary-color)]/10 to-transparent rounded-tl-2xl pointer-events-none`} />
            </InteractiveCard>
        </motion.div>
    );
}
