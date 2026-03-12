// components/layout/navbar-actions.tsx
"use client";

import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { ResumeToggle } from "@/components/ui/buttons/resume-toggle";

export function NavbarActions() {
  return (
    <div className="flex items-center gap-2">
      {/* Language Toggle */}
      <LanguageToggle />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Resume Toggle (NEW) */}
      <ResumeToggle />
    </div>
  );
}
