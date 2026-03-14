// components/sections/resume/hero-resume.tsx
"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { IDECodeBlock } from "@/components/ide-code-block";
import { BubbleBackground } from "@/components/bubble-background";
import { PrimaryButton, SecondaryButton, IconButton } from "@/components/ui/buttons";
import { personalInfo } from "@/data/resume-data";
import { Mail, Github, Linkedin, Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/language-provider";
import { translations } from "@/data/translations";

/**
 * HeroResume Component (Theme-Aware restoration)
 * 
 * Main landing section for the Resume version.
 * Features:
 * - Animated bubble background (Static, theme-aware)
 * - Responsive grid layout
 * - Interactive IDE code block (coder.js)
 * - CTAs and Social icons that adapt to Light/Dark mode
 */
export function HeroResume() {
    const { language } = useLanguage();
    const t = translations[language];

    /** Memoized code block content */
    const coderCode = useMemo(() => `const coder = {
  name: '${personalInfo.name}',
  nickname: '${personalInfo.nickname}',
  role: '${personalInfo.title}',
  skills: [
    'React', 
    'Next.js', 
    'TypeScript', 
    'UX/UI Design', 
    'IA Aplicada'
  ],
  hardWorker: true,
  quickLearner: true,
  problemSolver: true,
  hireable: function() {
    return (
      this.hardWorker &&
      this.problemSolver &&
      this.skills.length >= 5
    );
  }
};

console.log(coder.hireable()); // true`, []);

    const socialLinks = useMemo(() => [
        { icon: Github, href: personalInfo.github, label: "GitHub" },
        { icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn" },
    ], []);

    const handleContactClick = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleProjectsClick = () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center pb-24 overflow-hidden bg-transparent"
        >
            {/* Background Layers - Theme Aware */}
            <div className="absolute inset-0 bg-[var(--bg-primary)] -z-20 transition-colors duration-300" />
            <BubbleBackground interactive={false} className="absolute inset-0 -z-10 opacity-70" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
                    {/* Left Column - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="inline-block"
                            >
                                <Image
                                    src="/images/broche.png"
                                    alt="Fábio Soares"
                                    width={64}
                                    height={64}
                                    className="rounded-full border-2 border-[var(--secondary-color)] p-0.5 bg-[var(--bg-secondary)]"
                                />
                            </motion.div>
                            
                            <div className="space-y-1">
                                <p className="text-[var(--text-secondary)] text-lg font-medium opacity-80">
                                    {t.hero_resume.greeting}
                                </p>
                                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[var(--text-primary)] leading-[1] mb-2 z-10">
                                    {personalInfo.name}
                                </h1>
                            </div>

                            <p className="text-2xl md:text-3xl text-[var(--text-secondary)] leading-tight font-bold max-w-xl">
                                {t.hero_resume.role}
                            </p>
                        </div>

                        {/* Social Icons - Theme Aware */}
                        <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <IconButton
                                        key={social.label}
                                        icon={<Icon className="w-5 h-5" />}
                                        href={social.href}
                                        ariaLabel={social.label}
                                        variant="glass"
                                        size="md"
                                        className="bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--secondary-color)] hover:text-[var(--secondary-color)] transition-all"
                                    />
                                );
                            })}
                        </motion.div>

                        {/* CTAs - Theme Aware */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 pt-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <PrimaryButton
                                onClick={handleContactClick}
                                leftIcon={<Mail className="w-6 h-6" />}
                                aria-label={t.hero_resume.cta1}
                                size="lg"
                                className="shadow-lg hover:shadow-[0_0_30px_rgba(153,42,43,0.5)] font-black text-lg w-full sm:w-auto"
                            >
                                {t.hero_resume.cta1}
                            </PrimaryButton>
                            
                            <SecondaryButton
                                onClick={handleProjectsClick}
                                leftIcon={<Briefcase className="w-6 h-6" />}
                                aria-label={t.hero_resume.cta2}
                                size="lg"
                                className="font-black text-lg w-full sm:w-auto"
                            >
                                {t.hero_resume.cta2}
                            </SecondaryButton>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - IDE Code Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hidden lg:block relative"
                    >
                        <div className="absolute inset-0 bg-[var(--secondary-color)]/10 blur-[80px] -z-10 rounded-full" />
                        <IDECodeBlock
                            fileName="coder.js"
                            code={coderCode}
                            className="shadow-2xl translate-y-4 !bg-[#0d1117]" // Terminal stays dark as per design
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
