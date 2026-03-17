"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function RoiPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Don't show popup if already on the calculator page or if user dismissed it
    if (pathname === "/calculadora-roi" || hasDismissed) {
      setIsVisible(false);
      return;
    }

    // Show popup after 10 seconds of scrolling or spending time on site
    const timer = setTimeout(() => {
      if (!hasDismissed) {
        setIsVisible(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [pathname, hasDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 w-[90%] md:w-[400px] bg-[var(--bg-secondary)] border border-[var(--border-color)] p-5 rounded-2xl shadow-2xl"
        >
          <div className="absolute -top-3 -right-3">
            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-all shadow-md"
              aria-label="Close popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold mb-1 leading-tight">Quanto você perde com retrabalho?</h4>
              <p className="text-xs text-[var(--text-secondary)] mb-3">
                Calcule em 2 minutos o custo da sua operação manual e veja quanto a automação traria de lucro.
              </p>
              <Link 
                href="/calculadora-roi" 
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-color)] hover:text-orange-400 transition-colors group"
                onClick={() => setHasDismissed(true)}
              >
                Fazer Cálculo Grátis 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
