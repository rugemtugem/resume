"use client";

import { motion } from "framer-motion";
import { Zap, Users, TrendingUp, Code } from "lucide-react";
import { useLanguage } from "@/contexts/language-provider";
import { translations } from "@/data/translations";

const iconMap: Record<string, any> = {
  Zap,
  Users,
  TrendingUp,
  Code
};

export function WhyHireMeSection() {
  const { language } = useLanguage();
  const t = translations[language].why_hire_me;

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-[var(--primary-color)] 
                        uppercase tracking-wider mb-2">
            {t.subtitle}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            {t.title}
            <span className="text-gradient-neon">{t.highlight}</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.reasons.map((reason: any, index: number) => {
            const IconComponent = iconMap[reason.iconName];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] 
                           hover:border-[var(--primary-color)] hover:shadow-lg transition-all 
                           group flex gap-4 items-start"
              >
                <div className="shrink-0 p-3 rounded-xl bg-gradient-to-br from-[var(--primary-color)]/10 to-[var(--secondary-color)]/10 
                                group-hover:from-[var(--primary-color)] group-hover:to-[var(--secondary-color)] transition-all">
                  {IconComponent && (
                    <IconComponent className="w-6 h-6 text-[var(--primary-color)] group-hover:text-white transition-colors" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
