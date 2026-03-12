"use client";

import { createContext, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";

type PageMode = "partnership" | "resume";

interface PageModeContextType {
  mode: PageMode;
  isPartnership: boolean;
  isResume: boolean;
}

const PageModeContext = createContext<PageModeContextType | undefined>(
  undefined,
);

export function PageModeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const mode: PageMode = pathname === "/resume" ? "resume" : "partnership";

  const value: PageModeContextType = {
    mode,
    isPartnership: mode === "partnership",
    isResume: mode === "resume",
  };

  return (
    <PageModeContext.Provider value={value}>
      {children}
    </PageModeContext.Provider>
  );
}

export function usePageMode() {
  const context = useContext(PageModeContext);
  if (!context) {
    throw new Error("usePageMode must be used within PageModeProvider");
  }
  return context;
}
