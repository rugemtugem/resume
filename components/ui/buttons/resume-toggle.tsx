// components/ui/buttons/resume-toggle.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { IconButton } from "@/components/ui/buttons";
import { FileText, Home } from "lucide-react";
import { motion } from "framer-motion";

/**
 * ResumeToggle Component
 * 
 * Alterna entre versão de Parceria (/) e Currículo (/resume).
 * Mostra ícone de documento na homepage e ícone de casa no /resume.
 */
export function ResumeToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const isResumePage = pathname === "/resume";

  const handleToggle = () => {
    if (isResumePage) {
      router.push("/");
    } else {
      router.push("/resume");
    }
  };

  return (
    <IconButton
      icon={
        <motion.div
          key={isResumePage ? "home" : "resume"}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {isResumePage ? (
            <Home className="w-5 h-5" />
          ) : (
            <FileText className="w-5 h-5" />
          )}
        </motion.div>
      }
      ariaLabel={
        isResumePage 
          ? "Voltar para versão de parceria" 
          : "Ver currículo tradicional"
      }
      onClick={handleToggle}
      variant="outline"
      size="sm"
      tooltip={
        isResumePage 
          ? "Versão Parceria" 
          : "Versão Currículo"
      }
    />
  );
}
