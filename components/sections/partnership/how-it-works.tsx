"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, CheckCircle, Code, Rocket, TrendingUp, Clock, Package } from "lucide-react";
import { useRef, useState } from "react";
import { useLanguage } from "@/contexts/language-provider";
import { translations } from "@/data/translations";

const iconMap: Record<string, any> = {
  Calendar,
  CheckCircle,
  Code,
  Rocket,
  TrendingUp,
};

const stepStyles = [
  { gradient: "from-blue-500 to-cyan-500", glowColor: "rgba(59, 130, 246, 0.5)" },
  { gradient: "from-purple-500 to-pink-500", glowColor: "rgba(168, 85, 247, 0.5)" },
  { gradient: "from-orange-500 to-red-500", glowColor: "rgba(249, 115, 22, 0.5)" },
  { gradient: "from-green-500 to-emerald-500", glowColor: "rgba(34, 197, 94, 0.5)" },
  { gradient: "from-indigo-500 to-purple-500", glowColor: "rgba(99, 102, 241, 0.5)" }
];

export function HowItWorksSection() {
  const { language } = useLanguage();
  const t = translations[language].how_it_works;
  
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const timelineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section 
      id="process"
      ref={containerRef}
      className="py-20 px-4 md:px-8 relative overflow-hidden bg-[var(--bg-secondary)]"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/5 
                        via-transparent to-[var(--secondary-color)]/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary-color)]/10 rounded-full 
                        blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--secondary-color)]/10 rounded-full 
                        blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                          bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 
                          mb-6">
            <div className="w-2 h-2 bg-[var(--primary-color)] rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-[var(--primary-color)] uppercase tracking-wider">
              {t.tag}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent 
                         bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)]">
            {t.title}{" "}
            <span className="bg-gradient-to-r from-[var(--primary-color)] 
                           to-[var(--secondary-color)] bg-clip-text text-transparent">
              {t.highlight}
            </span>
          </h2>

          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Timeline Line (Base) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 
                          -translate-x-1/2 z-0">
            <div className="absolute inset-0 bg-gradient-to-b 
                            from-[var(--border-color)]/30 via-[var(--border-color)]/50 to-[var(--border-color)]/30" />
          </div>
          
          {/* Timeline Line (Animated Progress) */}
          <motion.div
            className="hidden md:block absolute left-1/2 top-0 w-1 
                       -translate-x-1/2 z-0 origin-top"
            style={{ 
              scaleY: timelineHeight,
              background: 'linear-gradient(to bottom, var(--primary-color), var(--secondary-color))',
              boxShadow: '0 0 20px var(--primary-color)'
            }}
          />

          {/* Lines for mobile devices */}
          <div className="md:hidden absolute left-8 top-0 bottom-0 w-0.5 
                          bg-[var(--border-color)]/30 z-0" />
          <motion.div
            className="md:hidden absolute left-8 top-0 w-1 
                       z-0 origin-top"
            style={{ 
              scaleY: timelineHeight,
              background: 'linear-gradient(to bottom, var(--primary-color), var(--secondary-color))',
              boxShadow: '0 0 20px var(--primary-color)'
            }}
          />

          {/* Steps */}
          <div className="space-y-16">
            {t.steps.map((step: any, index: number) => {
              const IconComponent = iconMap[step.iconName];
              const style = stepStyles[index] || stepStyles[0];

              return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                className="grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-center relative"
              >
                {/* Left side card or spacer (Desktop only) */}
                <div className={`${
                  index % 2 === 0 
                    ? 'col-start-2 md:col-start-1 md:text-right md:pr-8' 
                    : 'hidden md:block md:col-start-1'
                }`}>
                  {index % 2 === 0 && (
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="group relative"
                  >
                    {/* Glassmorphism Card */}
                    <div className="relative p-6 md:p-8 rounded-2xl overflow-hidden
                                    bg-[var(--bg-primary)]/60 backdrop-blur-xl
                                    border border-[var(--border-color)]/50
                                    shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                                    hover:bg-[var(--bg-primary)]/80 hover:border-[var(--primary-color)]/30
                                    transition-all duration-500">
                      
                      {/* Número Grande (Background) */}
                      <span className={`absolute ${index % 2 === 0 ? 'top-4 left-4' : 'top-4 right-4'} text-8xl font-black 
                                       text-[var(--text-primary)] opacity-5 select-none pointer-events-none
                                       group-hover:opacity-10 transition-opacity duration-500`}>
                        {step.number}
                      </span>

                      {/* Conteúdo */}
                      <div className="relative z-10">
                        {/* Título + Duração */}
                        <div className="mb-4">
                          <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2
                                       group-hover:bg-gradient-to-r 
                                       group-hover:from-[var(--primary-color)] 
                                       group-hover:to-[var(--secondary-color)]
                                       group-hover:bg-clip-text 
                                       group-hover:text-transparent
                                       transition-all duration-300 inline-block">
                            {step.title}
                          </h3>
                          <div className={`flex items-center gap-2 text-sm text-[var(--text-secondary)]
                                        ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                            <Clock className="w-4 h-4" />
                            <span>{step.duration}</span>
                          </div>
                        </div>

                        {/* Descrição */}
                        <p className="text-[var(--text-secondary)] leading-relaxed mb-4 text-sm md:text-base">
                          {step.description}
                        </p>

                        {/* Deliverable Badge */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg
                                      bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20
                                      ${index % 2 === 0 ? 'md:ml-auto md:float-right' : ''}`}>
                          <Package className="w-4 h-4 text-[var(--primary-color)] shrink-0" />
                          <span className="text-sm font-medium text-[var(--primary-color)]">
                            {step.deliverable}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  )}
                </div>

                {/* Icon (Center on Desktop, Left on Mobile) */}
                <div className="flex justify-center flex-col items-center col-start-1 md:col-start-2 relative z-20 mx-2 md:mx-0">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200, duration: 0.6 }}
                    className="relative group cursor-pointer"
                  >
                    {/* Glow Ring */}
                    <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-500"
                         style={{
                           background: `radial-gradient(circle, ${style.glowColor}, transparent)`
                         }} />

                    {/* Icon Container */}
                    <div className={`relative w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl md:rounded-2xl 
                                    bg-gradient-to-br ${style.gradient}
                                    flex items-center justify-center
                                    border-4 border-[var(--bg-secondary)]
                                    transition-all duration-500`}
                         style={{
                           boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.boxShadow = `0 0 30px ${style.glowColor}`;
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
                         }}>
                      {IconComponent && <IconComponent className="w-5 h-5 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" strokeWidth={2.5} />}
                    </div>

                    {/* Badge Número */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full
                                    bg-[var(--bg-secondary)] border-2 border-[var(--primary-color)]
                                    flex items-center justify-center
                                    shadow-lg">
                      <span className="text-[10px] md:text-xs font-bold text-[var(--primary-color)]">
                        {step.number}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Right side card or spacer (Desktop only) */}
                <div className={`${
                  index % 2 !== 0 
                    ? 'col-start-2 md:col-start-3 md:pl-8' 
                    : 'hidden md:block md:col-start-3'
                }`}>
                  {index % 2 !== 0 && (
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="group relative"
                  >
                    {/* Glassmorphism Card */}
                    <div className="relative p-6 md:p-8 rounded-2xl overflow-hidden
                                    bg-[var(--bg-primary)]/60 backdrop-blur-xl
                                    border border-[var(--border-color)]/50
                                    shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                                    hover:bg-[var(--bg-primary)]/80 hover:border-[var(--primary-color)]/30
                                    transition-all duration-500">
                      
                      {/* Número Grande (Background) */}
                      <span className={`absolute top-4 right-4 text-8xl font-black 
                                       text-[var(--text-primary)] opacity-5 select-none pointer-events-none
                                       group-hover:opacity-10 transition-opacity duration-500`}>
                        {step.number}
                      </span>

                      {/* Conteúdo */}
                      <div className="relative z-10">
                        {/* Título + Duração */}
                        <div className="mb-4">
                          <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2
                                       group-hover:bg-gradient-to-r 
                                       group-hover:from-[var(--primary-color)] 
                                       group-hover:to-[var(--secondary-color)]
                                       group-hover:bg-clip-text 
                                       group-hover:text-transparent
                                       transition-all duration-300 inline-block">
                            {step.title}
                          </h3>
                          <div className={`flex items-center gap-2 text-sm text-[var(--text-secondary)]
                                        ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                            <Clock className="w-4 h-4" />
                            <span>{step.duration}</span>
                          </div>
                        </div>

                        {/* Descrição */}
                        <p className="text-[var(--text-secondary)] leading-relaxed mb-4 text-sm md:text-base">
                          {step.description}
                        </p>

                        {/* Deliverable Badge */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg
                                      bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20
                                      ${index % 2 === 0 ? 'md:ml-auto md:float-right' : ''}`}>
                          <Package className="w-4 h-4 text-[var(--primary-color)] shrink-0" />
                          <span className="text-sm font-medium text-[var(--primary-color)]">
                            {step.deliverable}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  )}
                </div>
              </motion.div>
            )})}
          </div>
        </div>

        {/* CTA Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br 
                            from-[var(--primary-color)]/10 via-[var(--secondary-color)]/5 
                            to-[var(--primary-color)]/10" />
            <div className="absolute inset-0 backdrop-blur-3xl" />

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                {t.cta.title}
              </h3>
              
              <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
                {t.cta.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#contact"
                  className="group relative px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-white
                             bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]
                             shadow-xl hover:shadow-2xl transition-all overflow-hidden inline-block"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {t.cta.primary}
                  </span>
                  
                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </a>

                <a
                  href="#cases"
                  className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold
                             border-2 border-[var(--border-color)]
                             hover:bg-[var(--bg-primary)] transition-all inline-block"
                >
                  {t.cta.secondary}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
