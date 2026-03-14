"use client";

import { motion } from "framer-motion";
import { CheckCircle, Calendar, Code, Rocket, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/language-provider";
import { translations } from "@/data/translations";

const iconMap: Record<string, any> = {
  Calendar,
  CheckCircle,
  Code,
  Rocket,
  TrendingUp,
};

export function HowItWorksSection() {
  const { language } = useLanguage();
  const t = translations[language].how_it_works;

  return (
    <section id="process" className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-[var(--primary-color)] 
                        uppercase tracking-wider mb-4">
            {t.tag}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.title}{" "}
            <span className="text-gradient-neon">{t.highlight}</span>
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            {t.description}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Linha vertical (desktop) */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 
                          w-1 h-full bg-gradient-to-b from-[var(--primary-color)] 
                          to-[var(--secondary-color)] opacity-20" />

          {/* Steps */}
          <div className="space-y-16">
            {t.steps.map((step: any, index: number) => {
              const IconComponent = iconMap[step.iconName];
              
              return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative"
              >
                {/* Content */}
                <div className="lg:text-right">
                  <div className="mb-2">
                    <span className="text-5xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight">
                      {step.number}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  
                  <p className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="flex flex-wrap gap-4 items-center lg:justify-end text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--primary-color)]" />
                      <span className="text-[var(--text-secondary)]">
                        {step.duration}
                      </span>
                    </div>
                    
                    <div className="text-[var(--primary-color)] font-medium">
                      {step.deliverable}
                    </div>
                  </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br 
                                    from-[var(--primary-color)] to-[var(--secondary-color)]
                                    flex items-center justify-center shadow-lg
                                    transform hover:scale-105 transition-transform duration-300">
                      {IconComponent && <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-white" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            )})}
          </div>
        </div>

        {/* CTA Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 rounded-2xl 
                     bg-gradient-to-br from-[var(--primary-color)]/5 
                     to-[var(--secondary-color)]/5
                     border border-[var(--border-color)]"
        >
          <h3 className="text-2xl font-bold mb-4">
            {t.cta.title}
          </h3>
          <p className="text-lg text-[var(--text-secondary)] mb-6">
            {t.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="px-8 py-4 rounded-xl bg-gradient-to-r 
                               from-[var(--primary-color)] to-[var(--secondary-color)]
                               text-white font-semibold shadow-xl
                               hover:shadow-2xl hover:scale-105 transition-all text-center">
              {t.cta.primary}
            </a>
            <a href="#cases" className="px-8 py-4 rounded-xl border-2 
                               border-[var(--border-color)]
                               text-[var(--text-primary)] font-semibold
                               hover:bg-[var(--bg-secondary)] transition-all text-center">
              {t.cta.secondary}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
