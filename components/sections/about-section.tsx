"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { AnimatedCounter } from "@/components/ui/animated-counter";

import { useLanguage } from "@/components/language-provider";
import { translations } from "@/data/translations";

/**
 * AboutSection Component
 * 
 * Personal introduction section with biography text, profile photo,
 * animated progress bars for core competencies, and stats counters.
 * 
 * Features:
 * - Responsive two-column layout (50/50)
 * - Profile image with parallax scroll effect
 * - Hover glow and decorative blobs
 * - AnimatedProgress bars for core skills
 * - AnimatedCounter for key stats
 * - Vertical badge navigation to experience section
 * - Internationalization support (i18n)
 * 
 * @example
 * ```tsx
 * <AboutSection />
 * ```
 */
export function AboutSection() {
    const { language } = useLanguage();
    const t = translations[language];
    const imageRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: imageRef,
        offset: ["start end", "end start"]
    });
    const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

    return (
        <section id="about" className="relative py-20 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <div className="mb-12 text-center md:text-left max-w-6xl mx-auto">
                        <p className="text-[var(--color-accent-pink)] uppercase text-sm font-semibold mb-2">{t.about.title}</p>
                        <h2 className="text-4xl md:text-5xl font-bold">
                            {t.about.subtitle}
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto items-center">
                        {/* Left Column - Text + Progress Bars */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="text-lg text-[var(--color-text-secondary)] leading-relaxed space-y-4">
                                <p>{t.about.summary}</p>
                                <p>{t.about.description}</p>
                            </div>

                            {/* Core competency progress bars */}
                            <div className="space-y-4 pt-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                                    {language === 'pt' ? 'Competências Principais' : 'Core Competencies'}
                                </h3>
                                <AnimatedProgress value={95} label="Front-end Development" color="var(--primary-color)" delay={0} />
                                <AnimatedProgress value={90} label="UX/UI Design" color="var(--secondary-color)" delay={200} />
                                <AnimatedProgress value={85} label={language === 'pt' ? 'Liderança Técnica' : 'Tech Leadership'} color="var(--syntax-value)" delay={400} />
                                <AnimatedProgress value={80} label={language === 'pt' ? 'IA & Automação' : 'AI & Automation'} color="var(--accent-color)" delay={600} />
                            </div>

                            {/* Stats counters */}
                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="text-center p-4 rounded-xl bg-[var(--color-secondary-bg)] border border-[var(--color-border)]">
                                    <span className="text-2xl md:text-3xl font-bold text-[var(--primary-color)]">
                                        <AnimatedCounter value={25} suffix="+" />
                                    </span>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                        {language === 'pt' ? 'Anos' : 'Years'}
                                    </p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-[var(--color-secondary-bg)] border border-[var(--color-border)]">
                                    <span className="text-2xl md:text-3xl font-bold text-[var(--color-accent-cyan)]">
                                        <AnimatedCounter value={50} suffix="+" />
                                    </span>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                        {language === 'pt' ? 'Projetos' : 'Projects'}
                                    </p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-[var(--color-secondary-bg)] border border-[var(--color-border)]">
                                    <span className="text-2xl md:text-3xl font-bold text-[var(--color-accent-purple)]">
                                        <AnimatedCounter value={30} suffix="+" />
                                    </span>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                        {language === 'pt' ? 'Clientes' : 'Clients'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column - Photo + Badge + Parallax */}
                        <motion.div
                            ref={imageRef}
                            style={{ y: imageY }}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="relative flex justify-center lg:justify-end"
                        >
                            <div className="relative group w-full max-w-[500px]">
                                {/* Photo — responsive, aspect 3:4 */}
                                <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden border-2 border-[var(--color-border)] shadow-2xl hover:border-[var(--primary-color)] transition-all duration-500">
                                    <Image
                                        src="/images/perfil.png"
                                        alt="Fábio Soares"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Hover glow overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-color)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                                </div>

                                {/* Vertical Badge "EXPERIENCES" */}
                                <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                                    <a
                                        href="#experience"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="block cursor-pointer"
                                    >
                                        <div className="gradient-neon px-4 py-8 rounded-lg shadow-lg glow-pink hover:scale-105 transition-transform duration-300">
                                            <p className="text-white font-bold text-sm tracking-widest"
                                                style={{
                                                    writingMode: 'vertical-rl',
                                                    textOrientation: 'mixed'
                                                }}
                                            >
                                                {language === 'pt' ? 'EXPERIÊNCIAS' : 'EXPERIENCES'}
                                            </p>
                                        </div>
                                    </a>
                                </div>

                                {/* Decorative blur blobs */}
                                <div className="absolute -top-6 -left-6 w-28 h-28 bg-[var(--primary-color)]/10 rounded-full blur-3xl animate-pulse pointer-events-none" aria-hidden="true" />
                                <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-[var(--secondary-color)]/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} aria-hidden="true" />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
