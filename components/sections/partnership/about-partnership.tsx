// components/sections/partnership/about-partnership.tsx
"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Target, Zap, Target as TargetIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language-provider";
import { translations } from "@/data/translations";

const iconMap = [TrendingUp, Users, Zap, TargetIcon];

export function AboutPartnership() {
  const { language } = useLanguage();
  const t = translations[language].about;

  return (
    <section id="about" className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Focus on Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-sm font-semibold text-[var(--primary-color)] 
                        uppercase tracking-wider mb-4">
            {t.tag}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.title.split(language === 'pt' ? 'Gera Resultados' : 'Drives Results')[0]}
            <span className="text-gradient-neon">{language === 'pt' ? 'Gera Resultados' : 'Drives Results'}</span>
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            {t.summary}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* LEFT: Value Propositions */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {t.features.map((feature, idx) => {
              const Icon = iconMap[idx];
              const colors = [
                "from-green-500 to-emerald-600",
                "from-blue-500 to-indigo-600",
                "from-orange-500 to-red-600",
                "from-purple-500 to-pink-600"
              ];
              return (
                <div key={idx} className="flex gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${colors[idx]} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* RIGHT: Business Metrics (Stats Cards) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {t.stats.map((stat, idx) => {
              const colors = [
                "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 text-green-600",
                "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 text-blue-600",
                "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800 text-purple-600",
                "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800 text-orange-600"
              ];
              const colorClasses = colors[idx].split(' ');
              const textColor = colorClasses.pop();
              const border = colorClasses.pop();
              const darkBorder = colorClasses.pop();
              const bg = colorClasses.join(' ');

              return (
                <div key={idx} className={`p-8 rounded-2xl bg-gradient-to-br ${bg} border ${darkBorder} ${border}`}>
                  <div className={`text-5xl font-bold ${textColor} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {stat.label}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {stat.desc}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
