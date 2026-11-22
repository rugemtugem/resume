// components/sections/partnership/hero-partnership.tsx
"use client";

import { motion } from "framer-motion";
import { track } from "@/lib/analytics";
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/language-provider";
import { translations } from "@/data/translations";

export function HeroPartnership() {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center 
                        px-4 md:px-8 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div
        className="absolute inset-0 bg-gradient-to-br 
                      from-[var(--primary-color)]/5 via-transparent 
                      to-[var(--secondary-color)]/5"
      />

      <div className="max-w-5xl mx-auto text-center relative z-10 mt-20 md:mt-0">
        {/* Credibility Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 
                     rounded-full bg-[var(--bg-secondary)] 
                     border border-[var(--border-color)] mb-8"
        >
          <Sparkles className="w-4 h-4 text-[var(--primary-color)]" />
          <span className="text-sm font-medium">
            {t.badge}
          </span>
        </motion.div>

        {/* Headline Focused on Value */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[2rem] md:text-6xl font-bold mb-6 leading-tight"
        >
          {t.title}{" "}
          <span className="text-gradient-neon">{t.titleDestaque}</span>
        </motion.h1>

        {/* Clear Value Proposition */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-[var(--text-secondary)] 
                     mb-4 max-w-3xl mx-auto leading-relaxed"
        >
          {t.role}
        </motion.p>

        {/* Quick Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mb-12 text-sm 
                     text-[var(--text-secondary)]"
        >
          {t.facts.map((fact) => (
            <a
              key={fact.strong}
              href={fact.href}
              className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>
                <strong>{fact.strong}</strong> {fact.text}
              </span>
            </a>
          ))}
        </motion.div>

        {/* Partnership-Oriented CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <PrimaryButton
            size="lg"
            rightIcon={<ArrowRight className="w-5 h-5" />}
            aria-label={t.cta1}
            onClick={() => {
              track("cta_click", { cta_id: "hero_primario", cta_destination: "contato" });
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            {t.cta1}
          </PrimaryButton>

          <SecondaryButton
            size="lg"
            aria-label={t.cta2}
            onClick={() => {
              track("cta_click", { cta_id: "hero_secundario", cta_destination: "cases" });
              document.getElementById("cases")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            {t.cta2}
          </SecondaryButton>
        </motion.div>

      </div>
    </section>
  );
}
