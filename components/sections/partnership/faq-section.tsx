"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/language-provider";
import { translations } from "@/data/translations";

export function FAQSection() {
  const { language } = useLanguage();
  const t = translations[language].faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 px-4 md:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto">
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
            {t.title}
            <span className="text-gradient-neon">{t.highlight}</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {t.items.map((faq: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`border border-[var(--border-color)] rounded-2xl overflow-hidden transition-colors ${
                openIndex === index ? "bg-[var(--bg-secondary)]" : "bg-[var(--bg-primary)]"
              }`}
            >
              <button
                className="w-full px-6 py-6 text-left flex items-center justify-between focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-bold text-[var(--text-primary)] pr-8">
                  {faq.question}
                </span>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  openIndex === index 
                    ? "bg-[var(--primary-color)] text-white" 
                    : "bg-[var(--border-color)] text-[var(--text-secondary)]"
                }`}>
                  {openIndex === index ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-0 text-[var(--text-secondary)] leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
