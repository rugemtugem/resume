"use client";

import { motion } from "framer-motion";
import { IDECodeBlock } from "@/components/ide-code-block";
import { InteractiveCard } from "@/components/ui/interactive-card";
import { useClickParticles, ClickParticles } from "@/components/effects/click-particles";

import { useLanguage } from "@/components/language-provider";
import { translations } from "@/data/translations";

/**
 * ProjectsSection Component
 * 
 * Showcases portfolio projects with IDE-style code blocks, parallax stacking,
 * InteractiveCard for 3D tilt/glow, and click particle effects.
 * 
 * Features:
 * - Sticky parallax card stacking on scroll
 * - IDE-style code blocks (IDECodeBlock) wrapped in InteractiveCard
 * - 3D tilt and cursor glow via InteractiveCard
 * - Click particle burst effects
 * - Dynamic z-index management
 * - Internationalization support (i18n)
 * 
 * @example
 * ```tsx
 * <ProjectsSection />
 * ```
 */
export function ProjectsSection() {
    const { language } = useLanguage();
    const t = translations[language];
    const { particles, createParticles } = useClickParticles();

    return (
        <section id="projects" className="relative py-20 overflow-visible">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center uppercase">
                        <span className="text-gradient-neon">{t.projects.title}</span>
                    </h2>

                    {/* Cards com Parallax Stacking */}
                    <div className="max-w-6xl mx-auto relative">
                        {/* Click particles container */}
                        <ClickParticles particles={particles} />

                        {t.projects.items.map((project, index) => {
                            const projectCode = `const project = {
  name: "${project.name}",
  tools: ${JSON.stringify(project.tools, null, 2)},
  myRole: "${project.myRole}",
  description: "${project.description}"
};`;

                            // Sticky top: cada card para 50px abaixo do anterior
                            const stickyTop = 80 + (index * 50);

                            // Z-index invertido: primeiro projeto (index 0) tem maior z-index
                            const zIndex = t.projects.items.length - index;

                            return (
                                <div
                                    key={project.name}
                                    className="parallax-card-wrapper"
                                    style={{
                                        position: 'sticky',
                                        top: `${stickyTop}px`,
                                        marginBottom: index < t.projects.items.length - 1 ? '2rem' : '0',
                                    }}
                                    onClick={createParticles}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.01, zIndex: 999 }}
                                        transition={{ duration: 0.5 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        className="transition-transform duration-300"
                                        style={{
                                            position: 'relative',
                                            zIndex: zIndex
                                        }}
                                    >
                                        <InteractiveCard tilt glow shine={false}>
                                            <IDECodeBlock
                                                fileName={`${project.name.toLowerCase().replace(/\s+/g, '-')}.js`}
                                                code={projectCode}
                                                className="shadow-2xl hover:glow-neon transition-all duration-300"
                                            />
                                        </InteractiveCard>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Espaço extra para permitir scroll completo */}
                    <div style={{ height: '50vh' }} />
                </motion.div>
            </div>
        </section>
    );
}
