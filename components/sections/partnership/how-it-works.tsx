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

          <h2 className="text-4xl md:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent 
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
          {/* Animated Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 
                          bg-gradient-to-b from-transparent via-[var(--border-color)] 
                          to-transparent md:transform md:-translate-x-1/2" />
          
          <motion.div
            className="absolute left-8 md:left-1/2 top-0 w-1 
                       bg-gradient-to-b from-[var(--primary-color)] to-[var(--secondary-color)]
                       md:transform md:-translate-x-1/2 origin-top"
            style={{ scaleY: timelineHeight }}
          />

          {/* Steps */}
          <div className="space-y-16">
            {t.steps.map((step: any, index: number) => {
              const IconComponent = iconMap[step.iconName];
              const style = stepStyles[index] || stepStyles[0];

              return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setActiveStep(index)}
                onHoverEnd={() => setActiveStep(null)}
                className={`flex flex-col md:grid md:grid-cols-2 gap-8 items-center relative ${
                  index % 2 === 0 ? "" : "md:grid-flow-dense"
                }`}
              >
                {/* Content Card */}
                <div className={`${index % 2 === 0 ? "md:pr-12" : "md:pl-12 md:text-right"} w-full ml-16 md:ml-0`}>
                  <motion.div
                    className="group relative w-full"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Glassmorphism Card */}
                    <div className="relative p-6 md:p-8 rounded-2xl 
                                    bg-[var(--bg-primary)]/80 backdrop-blur-xl
                                    border border-[var(--border-color)]
                                    shadow-xl hover:shadow-2xl transition-all duration-500
                                    overflow-hidden">
                      {/* Glow Effect on Hover */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 
                                   transition-opacity duration-500 blur-2xl pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at ${index % 2 === 0 ? 'right' : 'left'}, ${style.glowColor}, transparent)`
                        }}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Step Number + Title */}
                        <div className={`flex items-start md:items-center gap-4 mb-4 flex-col md:flex-row ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                          <span className={`text-4xl md:text-6xl font-black bg-gradient-to-r ${style.gradient} 
                                          bg-clip-text text-transparent opacity-20 
                                          group-hover:opacity-40 transition-opacity leading-none hidden md:block`}>
                            {step.number}
                          </span>
                          <div className={`w-full ${index % 2 === 0 ? "" : "md:text-right"}`}>
                            <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] 
                                         group-hover:text-[var(--primary-color)] transition-colors mb-2">
                              {step.title}
                            </h3>
                            <div className={`flex items-center gap-2 text-xs md:text-sm text-[var(--text-secondary)] ${index % 2 === 0 ? "" : "md:justify-end"}`}>
                              <Clock className="w-4 h-4" />
                              <span>{step.duration}</span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className={`text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-4 ${index % 2 === 0 ? "" : "md:text-right"}`}>
                          {step.description}
                        </p>

                        {/* Deliverable Badge */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg
                                      bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20
                                      ${index % 2 === 0 ? "" : "md:ml-auto md:float-right"} max-w-full`}>
                          <Package className="w-3 h-3 md:w-4 md:h-4 text-[var(--primary-color)] shrink-0" />
                          <span className="text-xs md:text-sm font-medium text-[var(--primary-color)] truncate whitespace-normal sm:whitespace-nowrap">
                            {step.deliverable}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Icon */}
                <div className={`flex justify-center absolute left-2 top-6 md:top-auto md:relative lg:static ${
                  index % 2 === 0 ? "md:order-2" : "md:order-1"
                } md:left-auto md:mx-auto z-20`}>
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.15, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {/* Glow Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl blur-xl"
                      style={{
                        background: `linear-gradient(135deg, ${style.glowColor}, transparent)`
                      }}
                      animate={{
                        scale: activeStep === index ? [1, 1.2, 1] : 1,
                        opacity: activeStep === index ? [0.5, 1, 0.5] : 0.3
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Icon Container */}
                    <div className={`relative w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl md:rounded-2xl 
                                    bg-gradient-to-br ${style.gradient}
                                    flex items-center justify-center shadow-2xl
                                    border-4 border-[var(--bg-primary)]`}>
                      {IconComponent && <IconComponent className="w-5 h-5 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" 
                                 strokeWidth={2.5} />}
                    </div>

                    {/* Step Number Badge */}
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-8 md:h-8 rounded-full 
                                    bg-[var(--bg-primary)] border-2 border-[var(--primary-color)]
                                    flex items-center justify-center">
                      <span className="text-[9px] md:text-xs font-bold text-[var(--primary-color)]">
                        {step.number}
                      </span>
                    </div>
                  </motion.div>
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
