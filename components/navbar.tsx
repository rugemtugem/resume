"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { LinkButton, IconButton, GhostButton } from "@/components/ui/buttons";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { useLanguage } from "./language-provider";
import { translations } from "@/data/translations";

// Static section IDs for scroll detection
const SECTION_IDS = ["home", "about", "experience", "skills", "projects", "education", "contact"];

/**
 * Navbar Component
 * 
 * Fixed navigation bar with smooth scroll, language/theme toggles,
 * and responsive mobile menu. Highlights active section based on scroll position.
 * 
 * @example
 * ```tsx
 * <Navbar />
 * ```
 */
export function Navbar() {
    const { language } = useLanguage();
    const t = translations[language];
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [scrolled, setScrolled] = useState(false);

    /** Memoized navigation items - recalculated only when language changes */
    const navItems = useMemo(() => [
        { name: t.nav.home, href: "#home" },
        { name: t.nav.about, href: "#about" },
        { name: t.nav.experience, href: "#experience" },
        { name: t.nav.skills, href: "#skills" },
        { name: t.nav.projects, href: "#projects" },
        { name: t.nav.education, href: "#education" },
        { name: t.nav.contact, href: "#contact" },
    ], [t.nav]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            const current = SECTION_IDS.find((section) => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });

            if (current) setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /** Handle navigation click with smooth scroll */
    const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)]"
                : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center cursor-pointer"
                    >
                        <div className="relative h-10 w-[120px]">
                            <Image
                                src="/images/logo-nova.png"
                                alt="Fábio Soares"
                                fill
                                priority
                                className="object-contain"
                                sizes="120px"
                            />
                        </div>
                    </a>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const sectionId = item.href.substring(1);
                            return (
                                <LinkButton
                                    key={item.name}
                                    href={item.href}
                                    active={activeSection === sectionId}
                                    onClick={(e) => handleNavClick(e, sectionId)}
                                >
                                    {item.name}
                                </LinkButton>
                            );
                        })}
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>

                    {/* Mobile Menu Button + Language + Theme Toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        <LanguageToggle />
                        <ThemeToggle />
                        <IconButton
                            icon={isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            ariaLabel={isOpen ? "Fechar menu" : "Abrir menu"}
                            onClick={() => setIsOpen(!isOpen)}
                            variant="ghost"
                            size="md"
                        />
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden py-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)]/95"
                    >
                        {navItems.map((item) => {
                            const sectionId = item.href.substring(1);
                            return (
                                <GhostButton
                                    key={item.name}
                                    onClick={() => {
                                        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                                        setIsOpen(false);
                                    }}
                                    active={activeSection === sectionId}
                                    size="md"
                                    className="w-full justify-start"
                                >
                                    {item.name}
                                </GhostButton>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
}
