"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Clock, Star } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-provider";
import { translations, ProjectCase } from "@/data/translations";
import { TestimonialVideo } from "@/components/cases/testimonial-video";

export function ProjectsCases() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section id="cases" className="py-20 px-4 md:px-8 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-sm font-semibold text-[var(--primary-color)] 
                        uppercase tracking-wider mb-4">
            {t.success_cases.subtitle}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.success_cases.title.split(' ')[0]}{" "}
            <span className="text-gradient-neon">{t.success_cases.title.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            {t.success_cases.description}
          </p>
        </motion.div>

        <div className="space-y-24 mb-32">
          {(t.success_cases.items as any).map((caso: ProjectCase, index: number) => (
            <motion.div
              key={caso.client}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Image Representation - Logo */}
              <div className={`order-1 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-video rounded-2xl overflow-hidden 
                                border-2 border-[var(--border-color)]
                                shadow-2xl group bg-white flex items-center justify-center p-8 transition-transform hover:scale-[1.02] duration-300">
                  {caso.logo ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={caso.logo}
                        alt={caso.client}
                        fill
                        className="object-contain"
                        priority={index === 0}
                      />
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-[var(--primary-color)] opacity-50">
                      {caso.client}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                {/* Client & Industry */}
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-3xl font-bold">{caso.client}</h3>
                  <span className="px-3 py-1 rounded-full bg-[var(--primary-color)]/10 
                                 text-[var(--primary-color)] text-sm font-semibold">
                    {caso.industry}
                  </span>
                </div>

                {/* Challenge & Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-secondary)] 
                                   uppercase tracking-wider mb-2">
                      {language === 'pt' ? 'Desafio' : 'Challenge'}
                    </h4>
                    <p className="text-[var(--text-primary)] leading-relaxed">
                      {caso.challenge}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-secondary)] 
                                   uppercase tracking-wider mb-2">
                      {language === 'pt' ? 'Solução' : 'Solution'}
                    </h4>
                    <p className="text-[var(--text-primary)] leading-relaxed">
                      {caso.solution}
                    </p>
                  </div>
                </div>

                {/* Deliverables - New Section */}
                {caso.deliverables && (
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-[var(--text-secondary)] 
                                   uppercase tracking-wider mb-3">
                      {language === 'pt' ? 'Entregas & Impacto' : 'Deliverables & Impact'}
                    </h4>
                    <div className="space-y-3">
                      {caso.deliverables.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm p-3 rounded-lg bg-[var(--bg-primary)] border border-dashed border-[var(--border-color)]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-color)] mt-1.5 shrink-0" />
                          <div>
                            <span className="font-bold text-[var(--text-primary)]">{item.title}:</span>{" "}
                            <span className="text-[var(--text-secondary)]">{item.desc}</span>
                            <div className="text-[var(--primary-color)] font-medium mt-1">→ {item.impact}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {caso.metrics.map((result, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[var(--bg-primary)] 
                                            border border-[var(--border-color)] group/metric hover:border-[var(--primary-color)] transition-colors">
                      <TrendingUp className="w-5 h-5 text-[var(--primary-color)] mb-2" />
                      <div className="text-xl font-bold text-[var(--text-primary)] mb-1">
                        {result.label}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        {result.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Project Testimonial - New Section */}
                {caso.testimonial && (
                  <>
                    {caso.testimonial.videoUrl && caso.testimonial.videoThumbnail ? (
                      <div className="mt-8 mb-8">
                        <TestimonialVideo
                          videoUrl={caso.testimonial.videoUrl}
                          thumbnail={caso.testimonial.videoThumbnail}
                          author={caso.testimonial.author}
                          role={caso.testimonial.role}
                          quote={caso.testimonial.text}
                        />
                      </div>
                    ) : (
                      <blockquote className="border-l-4 border-[var(--primary-color)] pl-4 italic mb-8 py-1">
                        <p className="text-[var(--text-primary)] mb-2 text-sm">"{caso.testimonial.text}"</p>
                        <footer className="text-xs font-semibold not-italic text-[var(--text-secondary)]">
                          — {caso.testimonial.author}, {caso.testimonial.role}
                        </footer>
                      </blockquote>
                    )}
                  </>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {caso.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-[var(--bg-primary)] 
                                 border border-[var(--border-color)]
                                 text-xs font-medium text-[var(--text-secondary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pt-20 border-t border-[var(--border-color)]"
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
                  "{testimonial.text}"
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
                      {language === 'pt' ? 'Ver review' : 'View review'}
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
