"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { InfiniteCarousel } from "@/components/infinite-carousel";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { SkillBadge } from "@/components/ui/skill-badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { skills } from "@/data/resume-data";
import {
    SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiHtml5, SiCss3,
    SiTailwindcss, SiNodedotjs, SiGit, SiFigma, SiAdobexd, SiDocker,
    SiMongodb, SiMysql, SiPostgresql, SiAmazon, SiPython, SiVuedotjs,
    SiWordpress, SiBootstrap, SiMaterialdesign, SiPhp, SiPhpmyadmin,
    SiVercel, SiSupabase, SiFramer, SiNetlify,
    // UX/UI and Design Tools
    SiStorybook, SiMiro,
    SiHotjar,
    // Automation
    SiZapier,
    // AI and Machine Learning
    SiOpenai, SiTensorflow,
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";
import { Code, Palette, Brain, Wrench } from "lucide-react";

/** Map skill names to their corresponding react-icons component */
const skillIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    "React": SiReact,
    "Next.js": SiNextdotjs,
    "TypeScript": SiTypescript,
    "JavaScript": SiJavascript,
    "HTML5": SiHtml5,
    "CSS3": SiCss3,
    "Tailwind CSS": SiTailwindcss,
    "Node.js": SiNodedotjs,
    "Git": SiGit,
    "Figma": SiFigma,
    "Adobe XD": SiAdobexd,
    "Docker": SiDocker,
    "MongoDB": SiMongodb,
    "MySQL": SiMysql,
    "PostgreSQL": SiPostgresql,
    "AWS": SiAmazon,
    "Python": SiPython,
    "Vue.js": SiVuedotjs,
    "WordPress": SiWordpress,
    "Bootstrap": SiBootstrap,
    "Material Design": SiMaterialdesign,
    "PHP": SiPhp,
    "PHP MySQL": SiPhp,
    "PhpMyAdmin": SiPhpmyadmin,
    "Vercel": SiVercel,
    "Supabase": SiSupabase,
    "Framer Motion": SiFramer,
    "Netlify": SiNetlify,

    // UX/UI Design
    "UX/UI Design": SiFigma,
    "Design Systems": SiStorybook,
    "Design System": SiStorybook,
    "Prototipação": SiFramer,
    "Design Thinking": SiMiro,
    "Testes de Usabilidade": SiHotjar,
    "Design Centrado no Usuário": SiFigma,

    // Automação e IA
    "Automação de Processos": SiZapier,
    "Integração de IA": SiOpenai,
    "Análise de Dados": SiPython,
    "Otimização com IA": SiTensorflow,
    "Prompt Engineering": SiOpenai,

    // Development Tools
    "VS Code": VscCode,
};

/** Proficiency levels per skill (1-5) */
const skillLevels: Record<string, number> = {
    "React": 5, "Next.js": 5, "TypeScript": 4, "JavaScript": 5,
    "HTML5": 5, "CSS3": 5, "Tailwind CSS": 5, "Bootstrap": 4,
    "Git": 4, "Node.js": 3, "WordPress": 5, "PHP": 4,
    "MySQL": 4, "Docker": 3, "Vercel": 4, "Netlify": 3,
    "Figma": 5, "Adobe XD": 4, "Material Design": 4,
    "Design Systems": 5, "Prototipação": 4, "Design Thinking": 4,
    "Testes de Usabilidade": 4, "Design Centrado no Usuário": 5,
    "Automação de Processos": 4, "Integração de IA": 4,
    "Análise de Dados": 3, "Otimização com IA": 4, "Prompt Engineering": 5,
    "VS Code": 5,
};

/**
 * SkillsSection Component
 * 
 * Displays technical skills with animated tabs for categories,
 * SkillBadge cards with proficiency levels, and an infinite scrolling carousel.
 * 
 * Features:
 * - AnimatedTabs for skill categories (Technology, UX/UI, AI, Tools)
 * - SkillBadge with hover effects and proficiency dots
 * - AnimatedCounter for stats overview
 * - Infinite horizontal carousel with all skills
 * 
 * @example
 * ```tsx
 * <SkillsSection />
 * ```
 */
export function SkillsSection() {
    /** Memoized flattened skills array - combines all skill categories */
    const allSkills = useMemo(() => [
        ...skills.technology,
        ...skills.ux,
        ...skills.ai,
        ...skills.tools,
    ], []);

    /** Render a grid of SkillBadge components */
    const renderSkillGrid = (skillList: string[]) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {skillList.map((skill) => {
                const IconComponent = skillIcons[skill];
                return (
                    <SkillBadge
                        key={skill}
                        name={skill}
                        icon={IconComponent ? <IconComponent className="w-5 h-5" /> : undefined}
                        level={skillLevels[skill] || 3}
                    />
                );
            })}
        </div>
    );

    /** Tab definitions memoized */
    const tabs = useMemo(() => [
        {
            id: 'technology',
            label: 'Tecnologia',
            icon: <Code className="w-4 h-4" />,
            content: renderSkillGrid(skills.technology),
        },
        {
            id: 'ux',
            label: 'UX/UI',
            icon: <Palette className="w-4 h-4" />,
            content: renderSkillGrid(skills.ux),
        },
        {
            id: 'ai',
            label: 'IA & Automação',
            icon: <Brain className="w-4 h-4" />,
            content: renderSkillGrid(skills.ai),
        },
        {
            id: 'tools',
            label: 'Ferramentas',
            icon: <Wrench className="w-4 h-4" />,
            content: renderSkillGrid(skills.tools),
        },
    ], []);

    return (
        <section id="skills" className="relative py-20 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                        <span className="text-gradient-neon">Skills</span>
                    </h2>

                    {/* Stats counter row */}
                    <div className="flex justify-center gap-8 md:gap-16 mb-12">
                        <div className="text-center">
                            <span className="text-3xl md:text-4xl font-bold text-[var(--primary-color)]">
                                <AnimatedCounter value={allSkills.length} suffix="+" />
                            </span>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">Tecnologias</p>
                        </div>
                        <div className="text-center">
                            <span className="text-3xl md:text-4xl font-bold text-[var(--primary-color)]">
                                <AnimatedCounter value={25} suffix="+" />
                            </span>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">Anos XP</p>
                        </div>
                        <div className="text-center">
                            <span className="text-3xl md:text-4xl font-bold text-[var(--primary-color)]">
                                <AnimatedCounter value={4} />
                            </span>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">Categorias</p>
                        </div>
                    </div>

                    {/* Categorized tabs with SkillBadge */}
                    <AnimatedTabs
                        tabs={tabs}
                        variant="pills"
                        defaultTab="technology"
                        className="mb-16"
                    />

                    {/* Infinite carousel below */}
                    <InfiniteCarousel>
                        {/* Duplicate for infinite loop */}
                        {[...allSkills, ...allSkills].map((skill, index) => {
                            const IconComponent = skillIcons[skill];

                            return (
                                <motion.div
                                    key={`${skill}-${index}`}
                                    whileHover={{ scale: 1.5 }}
                                    className="skill-item flex-shrink-0 group relative"
                                >
                                    {/* Animated Border */}
                                    <div className="absolute inset-0 rounded-xl opacity-100 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--color-accent-pink)] via-[var(--color-accent-cyan)] to-[var(--color-accent-purple)] opacity-30 group-hover:opacity-100 blur-sm group-hover:blur-md transition-all duration-300" />
                                    </div>

                                    {/* Skill Card */}
                                    <div className="relative w-24 h-24 bg-[var(--color-secondary-bg)] border border-[var(--color-border)] rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:border-[var(--color-accent-pink)] group-hover:bg-[var(--color-secondary-bg)]/80 group-hover:z-10">
                                        {IconComponent ? (
                                            <IconComponent className="w-10 h-10 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-pink)] transition-colors duration-300" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-pink)]/20 flex items-center justify-center">
                                                <span className="text-2xl">⚡</span>
                                            </div>
                                        )}
                                        <p className="text-xs font-medium text-center px-1 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-pink)] transition-colors duration-300">
                                            {skill}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </InfiniteCarousel>
                </motion.div>
            </div>
        </section>
    );
}
