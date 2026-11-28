// components/layout/navbar.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { LinkButton, IconButton, GhostButton } from "@/components/ui/buttons";
import { NavbarActions } from "./navbar-actions";
import { useLanguage } from "@/contexts/language-provider";
import { usePageMode } from "@/contexts/page-mode-provider";
import { translations } from "@/data/translations";

const WHATSAPP_DIAGNOSTICO =
  "https://wa.me/5511986514401?text=" + encodeURIComponent("Oi, Fábio! Quero agendar o diagnóstico gratuito de 30 minutos.");

const SECTION_IDS = ["inicio", "sobre", "experiencia", "habilidades", "projetos", "educacao", "contato"];

export function Navbar() {
  const { language } = useLanguage();
  const { isResume } = usePageMode();
  const t = translations[language];
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [scrolled, setScrolled] = useState(false);

  // Fora da home e do currículo, as âncoras precisam levar para a home.
  const base = pathname === "/" || pathname === "/resume" ? "" : "/";

  // No currículo, o menu continua apontando para as seções da própria página.
  // No resto do site, leva às páginas de serviços, casos e blog, e às seções Sobre e Contato da home.
  const menuItems = useMemo(() => isResume ? [
    { id: "inicio", name: t.nav.home, href: "#home" },
    { id: "sobre", name: t.nav.about, href: "#about" },
    { id: "experiencia", name: t.nav.experience, href: "#experience" },
    { id: "habilidades", name: t.nav.skills, href: "#skills" },
    { id: "projetos", name: t.nav.projects, href: "#projects" },
    { id: "educacao", name: t.nav.education, href: "#education" },
    { id: "contato", name: t.nav.contact, href: "#contact" },
  ] : [
    { id: "servicos", name: "Serviços", href: "/servicos" },
    { id: "casos", name: "Casos", href: "/casos" },
    { id: "projetos", name: "Projetos", href: "/projetos" },
    { id: "blog", name: "Blog", href: "/blog" },
    { id: "sobre", name: t.nav.about, href: `${base}#about` },
    { id: "contato", name: t.nav.contact, href: `${base}#contact` },
  ], [t.nav, base, isResume]);

  // Página atual marca o item do menu; na home, vale a seção que está na tela.
  const rotaAtiva = menuItems.find((item) => !item.href.includes("#") && pathname.startsWith(item.href))?.id;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (window.scrollY < 100) {
        setActiveSection(isResume ? "inicio" : "");
        return;
      }

      const current = menuItems.find((item) => {
        const sectionId = item.href.split("#")[1];
        if (!sectionId) return false;
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      setActiveSection(current ? current.id : "");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuItems, isResume]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (targetId === "home") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsOpen(false);
        return;
    }
    const element = targetId ? document.getElementById(targetId) : null;
    if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  }, []);

  // Menu do celular: rola até a seção se ela está nesta página; senão, navega.
  const irPara = useCallback((href: string) => {
    const id = href.split("#")[1];
    const element = id ? document.getElementById(id) : null;
    // No celular o menu fecha com animação, e a mudança de altura cancelava a rolagem suave.
    // Por isso o menu fecha primeiro e a rolagem começa depois que ele sumiu.
    const menuAberto = isOpen;
    setIsOpen(false);
    if (element) window.setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), menuAberto ? 350 : 0);
    else router.push(href);
  }, [router, isOpen]);

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
            aria-label={"Fábio Rugemtugem - Ir para o topo"}
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
                alt="Fábio Rugemtugem"
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
              const sectionId = item.href.split("#")[1];
              return (
                <LinkButton
                  key={item.id}
                  href={item.href}
                  active={(rotaAtiva ?? activeSection) === item.id}
                  aria-label={item.name}
                  onClick={(e) => handleNavClick(e, sectionId)}
                >
                  {item.name}
                </LinkButton>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!isResume && (
              <a
                href={WHATSAPP_DIAGNOSTICO}
                target="_blank"
                rel="noopener noreferrer"
                data-local="menu"
                className="hidden md:inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Diagnóstico gratuito
              </a>
            )}
            <NavbarActions />
          </div>

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
                  const sectionId = item.href.split("#")[1];
                  return (
                    <GhostButton
                      key={item.id}
                      onClick={() => irPara(item.href)}
                      active={(rotaAtiva ?? activeSection) === item.id}
                      aria-label={item.name}
                      size="md"
                      className="w-full justify-start"
                    >
                      {item.name}
                    </GhostButton>
                  );
                })}
                {!isResume && (
                  <a
                    href={WHATSAPP_DIAGNOSTICO}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-local="menu"
                    className="mt-2 inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]"
                  >
                    Diagnóstico gratuito
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
