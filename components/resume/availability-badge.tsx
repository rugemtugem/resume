"use client";

import { useLanguage } from "@/contexts/language-provider";

export function AvailabilityBadge() {
  const { language } = useLanguage();
  const text = language === 'pt' ? 'Disponível para Oportunidades' : 'Available for Opportunities';

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full
                    bg-green-50 dark:bg-green-900/20 
                    border-2 border-green-500 shadow-sm
                    hover:scale-105 transition-transform cursor-default">
      <div className="relative">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full 
                        animate-ping opacity-75" />
      </div>
      <span className="text-sm font-semibold text-green-700 dark:text-green-400">
        {text}
      </span>
    </div>
  );
}
