"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { IDECodeBlock } from "@/components/ide-code-block";
import { BubbleBackground } from "@/components/bubble-background";
import { PrimaryButton, SecondaryButton, IconButton } from "@/components/ui/buttons";
import { useClickParticles, ClickParticles } from "@/components/effects/click-particles";
import { personalInfo } from "@/data/resume-data";
import { Mail, Github, Linkedin, Briefcase } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { translations } from "@/data/translations";

/**
 * HeroSection Component
 * 
 * Main landing section with animated background, personal info,
 * social links, CTAs, click particles, and an IDE-style code block.
 * 
 * Features:
 * - Animated bubble background (BubbleBackground)
 * - Responsive grid layout
 * - Framer Motion animations
 * - Interactive IDE code block
 * - Premium button system with ripple effects
 * - Click particle effects on CTA interaction
 * 
 * @example
 * ```tsx
 * <HeroSection />
 * ```
 */
export function HeroSection() {
    const { language } = useLanguage();
    const t = translations[language];
    const { particles, createParticles } = useClickParticles();

    /** Memoized code block content - recalculated only when language/personalInfo changes */
    const coderCode = useMemo(() => `const coder = {
  name: '${personalInfo.name}',
  nickname: '${personalInfo.nickname}',
  role: '${t.personal.title}',
  skills: [
    'React', 'Next.js', 'TypeScript',
    'UX/UI Design', 'IA Aplicada'
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

console.log(coder.hireable()); // true`, [t.personal.title]);

    /** Memoized social links - static data that doesn't change */
    const socialLinks = useMemo(() => [
        { icon: Github, href: personalInfo.github, label: "GitHub" },
        { icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn" },
    ], []);

    const handleContactClick = (e: React.MouseEvent) => {
        createParticles(e);
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleProjectsClick = (e: React.MouseEvent) => {
        createParticles(e);
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
        >
            {/* Background Effects */}
            <BubbleBackground
                className="absolute inset-0 -z-10"
            />

            {/* Click particles */}
            <ClickParticles particles={particles} />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
                    {/* Left Column - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <Image
                                src="/images/broche.png"
                                alt="Broche"
                                width={48}
                                height={48}
                                className="rounded-full inline-block animate-wave"
                            />
                            <p className="text-[var(--text-secondary)] text-base sm:text-lg">
                                {t.hero.greeting}
                            </p>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold flex items-center gap-3">
                                {t.hero.name}{" "}
                            </h1>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[var(--text-primary)]">
                                {t.hero.role}
                            </h2>
                        </div>

                        {/* Social Icons - Using IconButton */}
                        <motion.div
                            className="flex items-center gap-3 sm:gap-4 pt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <motion.div
                                        key={social.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    >
                                        <IconButton
                                            icon={<Icon className="w-5 h-5" />}
                                            href={social.href}
                                            ariaLabel={social.label}
                                            variant="glass"
                                            size="md"
                                            tooltip={social.label}
                                        />
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* CTAs - Using PrimaryButton and SecondaryButton */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <PrimaryButton
                                onClick={handleContactClick}
                                leftIcon={<Mail className="w-5 h-5" />}
                                size="lg"
                                fullWidth
                                className="sm:w-auto"
                            >
                                {t.hero.cta1}
                            </PrimaryButton>

                            <SecondaryButton
                                onClick={handleProjectsClick}
                                leftIcon={<Briefcase className="w-5 h-5" />}
                                size="lg"
                                fullWidth
                                className="sm:w-auto"
                            >
                                {t.hero.cta2}
                            </SecondaryButton>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Code Window */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <IDECodeBlock fileName="coder.js" code={coderCode} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
