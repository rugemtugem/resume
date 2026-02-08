'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/components/language-provider';
import { translations } from '@/data/translations';
import { IconButton } from '@/components/ui/buttons/icon-button';
import { personalInfo } from '@/data/resume-data';
import {
    Github,
    Linkedin,
    Mail,
    Heart,
    ArrowUp,
    Code2,
    Sparkles,
    Coffee,
    MapPin,
    ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

/**
 * Footer Component — Premium
 *
 * 4-column responsive footer with brand, navigation, tech stack,
 * social links, CTA, back-to-top, animated gradient line, and easter egg.
 */
export function Footer() {
    const { language } = useLanguage();
    const t = translations[language];
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navLinks = [
        { href: '#home', label: t.nav?.home || 'Início' },
        { href: '#about', label: t.nav?.about || 'Sobre' },
        { href: '#experience', label: t.nav?.experience || 'Experiência' },
        { href: '#skills', label: t.nav?.skills || 'Habilidades' },
        { href: '#projects', label: t.nav?.projects || 'Projetos' },
        { href: '#education', label: t.nav?.education || 'Educação' },
        { href: '#contact', label: t.nav?.contact || 'Contato' },
    ];

    const socialLinks = [
        {
            icon: Github,
            label: 'GitHub',
            href: personalInfo.github,
            color: 'hover:text-purple-500',
        },
        {
            icon: Linkedin,
            label: 'LinkedIn',
            href: personalInfo.linkedin,
            color: 'hover:text-blue-500',
        },
        {
            icon: Mail,
            label: 'Email',
            href: `mailto:${personalInfo.email}`,
            color: 'hover:text-green-500',
        },
    ];

    const techStack = [
        'Next.js',
        'React',
        'TypeScript',
        'Tailwind CSS',
        'Framer Motion',
    ];

    return (
        <footer className="relative bg-[var(--bg-secondary)] border-t border-[var(--border-color)] overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary-color)]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--secondary-color)]/5 rounded-full blur-3xl" />
            </div>

            {/* Animated Gradient Line */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary-color)] to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                viewport={{ once: true }}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                {/* Main Footer Content — 4 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                    {/* Column 1: Brand & Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                                className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] flex items-center justify-center"
                            >
                                <Code2 className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                                    {personalInfo.nickname}
                                </h3>
                                <p className="text-xs text-[var(--text-secondary)]">
                                    Tecnologia & IA | Desenvolvedor Front-end & UX
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                            {language === 'pt'
                                ? 'Transformando ideias em experiências digitais memoráveis através de código limpo e design intuitivo.'
                                : 'Transforming ideas into memorable digital experiences through clean code and intuitive design.'}
                        </p>

                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <MapPin className="w-4 h-4 text-[var(--primary-color)]" />
                            <span>{personalInfo.location}</span>
                        </div>
                    </motion.div>

                    {/* Column 2: Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[var(--primary-color)]" />
                            {language === 'pt' ? 'Navegação' : 'Navigation'}
                        </h4>
                        <nav className="space-y-2">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        href={link.href}
                                        className="group flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
                                    >
                                        <span className="w-0 h-px bg-[var(--primary-color)] group-hover:w-4 transition-all duration-300" />
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>

                    {/* Column 3: Tech Stack */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Coffee className="w-4 h-4 text-[var(--primary-color)]" />
                            {language === 'pt' ? 'Tecnologias' : 'Tech Stack'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {techStack.map((tech, index) => (
                                <motion.span
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.05 * index }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] border border-[var(--primary-color)]/20 cursor-default"
                                >
                                    {tech}
                                </motion.span>
                            ))}
                        </div>

                        {/* Status Badge */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            viewport={{ once: true }}
                            className="mt-6 p-4 rounded-lg bg-gradient-to-br from-[var(--primary-color)]/5 to-[var(--secondary-color)]/5 border border-[var(--border-color)]"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-semibold text-[var(--text-primary)]">
                                    {language === 'pt' ? 'Disponível para Projetos' : 'Available for Projects'}
                                </span>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)]">
                                {language === 'pt'
                                    ? 'Aberto a freelances e oportunidades'
                                    : 'Open to freelance and opportunities'}
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Column 4: Social & CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-[var(--primary-color)]" />
                            {language === 'pt' ? 'Vamos Conectar' : "Let's Connect"}
                        </h4>

                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                            {language === 'pt'
                                ? 'Entre em contato para discutir projetos, colaborações ou apenas para trocar ideias!'
                                : 'Get in touch to discuss projects, collaborations or just to exchange ideas!'}
                        </p>

                        <div className="flex gap-3 mb-6">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <IconButton
                                        key={social.label}
                                        icon={<Icon className="w-5 h-5" />}
                                        href={social.href}
                                        ariaLabel={social.label}
                                        variant="outline"
                                        size="md"
                                        tooltip={social.label}
                                        className={social.color}
                                    />
                                );
                            })}
                        </div>

                        <Link
                            href="#contact"
                            className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white text-sm font-medium hover:shadow-lg hover:shadow-[var(--primary-color)]/25 transition-all"
                        >
                            <Mail className="w-4 h-4" />
                            <span>{language === 'pt' ? 'Enviar Mensagem' : 'Send Message'}</span>
                            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent mb-8"
                />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-sm text-[var(--text-secondary)] text-center md:text-left"
                    >
                        <p className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                            <span>© {currentYear} {personalInfo.name}.</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1">
                                {language === 'pt' ? 'Feito com' : 'Made with'}
                                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                                {language === 'pt' ? 'e muito café' : 'and lots of coffee'}
                                <Coffee className="w-4 h-4 text-amber-600" />
                            </span>
                        </p>
                    </motion.div>

                    {/* Back to Top Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                        onClick={scrollToTop}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:border-[var(--primary-color)]/50 transition-all"
                        aria-label={language === 'pt' ? 'Voltar ao topo' : 'Back to top'}
                    >
                        <span className="text-sm font-medium">
                            {language === 'pt' ? 'Voltar ao Topo' : 'Back to Top'}
                        </span>
                        <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                    </motion.button>
                </div>

                {/* Hidden Easter Egg */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 2 }}
                    viewport={{ once: true }}
                    className="text-center mt-8"
                >
                    <p className="text-xs text-[var(--text-secondary)]/50 font-mono">
                        {language === 'pt'
                            ? '// Se você está lendo isso, você é curioso. Vamos trabalhar juntos! 🚀'
                            : "// If you're reading this, you're curious. Let's work together! 🚀"}
                    </p>
                </motion.div>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[var(--primary-color)]/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[var(--secondary-color)]/10 to-transparent pointer-events-none" />
        </footer>
    );
}
