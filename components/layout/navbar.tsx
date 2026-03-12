// components/layout/navbar.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { LinkButton, IconButton, GhostButton } from "@/components/ui/buttons";
import { NavbarActions } from "./navbar-actions";
import { useLanguage } from "@/contexts/language-provider";
import { usePageMode } from "@/contexts/page-mode-provider";
import { translations } from "@/data/translations";

const SECTION_IDS = ["inicio", "sobre", "experiencia", "habilidades", "projetos", "educacao", "contato"];

export function Navbar() {
  const { language } = useLanguage();
  const { isResume } = usePageMode();
  const t = translations[language];
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [scrolled, setScrolled] = useState(false);

  // Memoized navigation items
  const menuItems = useMemo(() => [
    { id: "inicio", name: t.nav.home, href: "#home" },
    { id: "sobre", name: t.nav.about, href: "#about" },
    { id: "experiencia", name: t.nav.experience, href: "#experience" },
    { id: "habilidades", name: t.nav.skills, href: "#skills" },
    { id: "projetos", name: t.nav.projects, href: isResume ? "#projects" : "#cases" },
    { id: "educacao", name: t.nav.education, href: "#education" },
    { id: "contato", name: t.nav.contact, href: "#contact" },
  ], [t.nav]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (window.scrollY < 100) {
        setActiveSection("inicio");
        return;
      }

      const current = menuItems.find((item) => {
        const sectionId = item.href.substring(1);
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (current) setActiveSection(current.id);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuItems]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (targetId === "home") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsOpen(false);
        return;
    }
    const element = document.getElementById(targetId);
    if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
    }
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
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            href={pathname === "/resume" ? "/resume" : "/"}
            className="flex items-center gap-3 group"
            aria-label={language === 'pt' ? "Fábio Soares - Ir para o topo" : "Fábio Soares - Go to top"}
            onClick={(e) => {
                if ((pathname === "/" && !pathname.includes("#")) || (pathname === "/resume" && pathname === "/resume")) {
                    // e.preventDefault();
                    // window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }}
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
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const sectionId = item.href.substring(1);
              return (
                <LinkButton
                  key={item.id}
                  href={item.href}
                  active={activeSection === item.id}
                  aria-label={item.name}
                  onClick={(e) => handleNavClick(e, sectionId)}
                >
                  {item.name}
                </LinkButton>
              );
            })}
          </div>

          {/* Actions */}
          <NavbarActions />

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
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
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden py-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)]/95 overflow-hidden"
            >
              <div className="flex flex-col gap-2">
                {menuItems.map((item) => {
                  const sectionId = item.href.substring(1);
                  return (
                    <GhostButton
                      key={item.id}
                      onClick={(e) => handleNavClick(e as any, sectionId)}
                      active={activeSection === item.id}
                      aria-label={item.name}
                      size="md"
                      className="w-full justify-start"
                    >
                      {item.name}
                    </GhostButton>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
