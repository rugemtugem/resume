// components/layout/navbar-actions.tsx
"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export function NavbarActions() {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
    </div>
  );
}
