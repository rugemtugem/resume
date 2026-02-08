'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { translations } from '@/data/translations';
import { InteractiveCard } from '@/components/ui/interactive-card';
import {
    GraduationCap,
    Award,
    Calendar,
    MapPin,
    BookOpen,
    TrendingUp,
    Star,
    CheckCircle2,
    ExternalLink
} from 'lucide-react';

interface EducationItem {
    id: string;
    degree: string;
    institution: string;
    location: string;
    period: string;
    description?: string;
    highlights?: readonly string[];
    gpa?: string;
    type: 'graduation' | 'postgrad' | 'certification';
    status?: 'completed' | 'in-progress';
    link?: string;
}

export function EducationSection() {
    const { language } = useLanguage();
    const t = translations[language];
    const sectionRef = useRef<HTMLElement>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'graduation' | 'postgrad' | 'certification'>('all');

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

    const education = t.education.items as unknown as EducationItem[];

    const filteredEducation = activeFilter === 'all'
        ? education
        : education.filter(item => item.type === activeFilter);

    const filters = [
        { value: 'all', label: language === 'pt' ? 'Todos' : 'All', icon: BookOpen },
        { value: 'graduation', label: language === 'pt' ? 'Graduação' : 'Graduation', icon: GraduationCap },
        { value: 'postgrad', label: language === 'pt' ? 'Pós-Graduação' : 'Postgraduate', icon: Award },
        { value: 'certification', label: language === 'pt' ? 'Certificações' : 'Certifications', icon: Star },
    ];

    const stats = [
        { value: education.filter(e => e.type === 'graduation').length, label: language === 'pt' ? 'Graduações' : 'Degrees' },
        { value: education.filter(e => e.type === 'postgrad').length, label: language === 'pt' ? 'Pós-Graduações' : 'Postgraduate' },
        { value: education.filter(e => e.type === 'certification').length, label: language === 'pt' ? 'Certificações' : 'Certifications' },
    ];

    return (
        <section
            id="education"
            ref={sectionRef}
            className="relative py-20 overflow-hidden"
        >
            {/* Animated Background Elements */}
            <motion.div
                style={{ y: y1 }}
                className="absolute top-10 left-0 w-96 h-96 bg-[var(--primary-color)]/5 rounded-full blur-3xl -z-10"
            />
            <motion.div
                style={{ y: y2 }}
                className="absolute bottom-10 right-0 w-96 h-96 bg-[var(--secondary-color)]/5 rounded-full blur-3xl -z-10"
            />

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
                            <GraduationCap className="w-4 h-4 text-[var(--primary-color)]" />
                            <span className="text-sm font-medium text-[var(--primary-color)]">
                                {t.education.subtitle}
                            </span>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-neon">
                            {t.education.title}
                        </h2>

                        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                            {t.education.description}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center p-6 rounded-2xl bg-gradient-to-br from-[var(--primary-color)]/5 to-[var(--secondary-color)]/5 border border-[var(--border-color)]"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-[var(--primary-color)] mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-[var(--text-secondary)] font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-3 mb-12"
                    >
                        {filters.map((filter) => {
                            const Icon = filter.icon;
                            const isActive = activeFilter === filter.value;

                            return (
                                <button
                                    key={filter.value}
                                    onClick={() => setActiveFilter(filter.value as 'all' | 'graduation' | 'postgrad' | 'certification')}
                                    className={`
                    flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all
                    ${isActive
                                            ? 'bg-[var(--primary-color)] text-white shadow-lg shadow-[var(--primary-color)]/25'
                                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--primary-color)]/10 hover:text-[var(--primary-color)]'
                                        }
                  `}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm">{filter.label}</span>
                                </button>
                            );
                        })}
                    </motion.div>

                    {/* Education Grid */}
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredEducation.map((item, index) => (
                                <EducationCard
                                    key={item.id}
                                    education={item}
                                    index={index}
                                    language={language}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Achievement Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                        className="mt-16 text-center"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[var(--primary-color)]/10 via-[var(--secondary-color)]/10 to-[var(--primary-color)]/10 border border-[var(--primary-color)]/20">
                            <TrendingUp className="w-5 h-5 text-[var(--primary-color)]" />
                            <span className="text-sm font-semibold text-[var(--text-primary)]">
                                {language === 'pt'
                                    ? 'Sempre aprendendo e evoluindo profissionalmente'
                                    : 'Always learning and evolving professionally'
                                }
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

function EducationCard({
    education,
    index,
    language
}: {
    education: EducationItem;
    index: number;
    language: 'pt' | 'en';
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInProgress = education.status === 'in-progress';

    const typeConfig = {
        graduation: {
            icon: GraduationCap,
            color: 'blue',
            label: language === 'pt' ? 'Graduação' : 'Graduation'
        },
        postgrad: {
            icon: Award,
            color: 'purple',
            label: language === 'pt' ? 'Pós-Graduação' : 'Postgraduate'
        },
        certification: {
            icon: Star,
            color: 'amber',
            label: language === 'pt' ? 'Certificação' : 'Certification'
        }
    };

    const config = typeConfig[education.type];
    const Icon = config.icon;

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
            }}
            viewport={{ once: true, margin: "-50px" }}
        >
            <InteractiveCard className="h-full group hover:scale-[1.02] transition-transform">
                <div className="p-6 md:p-8 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        {/* Icon */}
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className={`
                p-3 rounded-xl bg-gradient-to-br
                ${config.color === 'blue' ? 'from-blue-500/10 to-blue-600/10 text-blue-600' : ''}
                ${config.color === 'purple' ? 'from-purple-500/10 to-purple-600/10 text-purple-600' : ''}
                ${config.color === 'amber' ? 'from-amber-500/10 to-amber-600/10 text-amber-600' : ''}
              `}
                        >
                            <Icon className="w-6 h-6" />
                        </motion.div>

                        {/* Type Badge */}
                        <span className={`
              px-3 py-1 text-xs font-semibold rounded-full
              ${config.color === 'blue' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' : ''}
              ${config.color === 'purple' ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20' : ''}
              ${config.color === 'amber' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : ''}
            `}>
                            {config.label}
                        </span>
                    </div>

                    {/* Degree */}
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--primary-color)] transition-colors">
                        {education.degree}
                    </h3>

                    {/* Institution */}
                    <p className="text-base font-semibold text-[var(--primary-color)] mb-4 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {education.institution}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                            <Calendar className="w-4 h-4" />
                            <span>{education.period}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                            <MapPin className="w-4 h-4" />
                            <span>{education.location}</span>
                        </div>

                        {education.gpa && (
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400">
                                <TrendingUp className="w-4 h-4" />
                                <span>GPA: {education.gpa}</span>
                            </div>
                        )}
                    </div>

                    {/* Status Badge */}
                    {isInProgress && (
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 mb-4 w-fit"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                {language === 'pt' ? 'EM ANDAMENTO' : 'IN PROGRESS'}
                            </span>
                        </motion.div>
                    )}

                    {/* Description */}
                    {education.description && (
                        <p className="text-sm text-[var(--text-secondary)] mb-4 flex-grow">
                            {education.description}
                        </p>
                    )}

                    {/* Highlights */}
                    {education.highlights && education.highlights.length > 0 && (
                        <div className="mb-4">
                            <div className="text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
                                {language === 'pt' ? 'Destaques' : 'Highlights'}
                            </div>
                            <ul className="space-y-1.5">
                                {education.highlights.map((highlight, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        viewport={{ once: true }}
                                        className="text-sm text-[var(--text-secondary)] flex items-start gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>{highlight}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Link */}
                    {education.link && (
                        <a
                            href={education.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors mt-auto"
                        >
                            <span>{language === 'pt' ? 'Ver credencial' : 'View credential'}</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}

                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--primary-color)]/5 to-transparent rounded-tr-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </InteractiveCard>
        </motion.div>
    );
}
