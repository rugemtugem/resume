"use client";

import React, { createContext, useContext } from "react";

/** O site é só em português. O contexto fica para os componentes que leem `translations[language]`. */
type Language = "pt";

interface LanguageContextType {
    language: Language;
    isReady: boolean;
}

const VALUE: LanguageContextType = { language: "pt", isReady: true };

const LanguageContext = createContext<LanguageContextType>(VALUE);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    return <LanguageContext.Provider value={VALUE}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    return useContext(LanguageContext);
}
