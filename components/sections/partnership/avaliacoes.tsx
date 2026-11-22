"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-provider";
import { translations } from "@/data/translations";

/** Avaliações do Google, logo abaixo do topo: a prova fica perto do botão do diagnóstico. */
export function Avaliacoes() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section id="avaliacoes" className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        {/* Google Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.testimonials.title}</h2>
            <p className="text-[var(--text-secondary)] flex items-center justify-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              {t.testimonials.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.testimonials.items.map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-lg hover:border-[var(--primary-color)] transition-colors duration-300 flex flex-col h-full"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg italic text-[var(--text-primary)] mb-6 flex-grow">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-3">
                    {testimonial.avatar ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--border-color)]">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-color)]">
                        <span className="text-xs font-bold text-[var(--text-secondary)]">
                          {testimonial.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="font-bold text-[var(--text-primary)]">
                      {testimonial.author}
                    </div>
                  </div>
                  
                  {testimonial.reviewLink && (
                    <a
                      href={testimonial.reviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--primary-color)] hover:underline font-medium"
                    >
                      {'Ver review'}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
