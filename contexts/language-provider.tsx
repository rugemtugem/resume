"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

/** Supported language codes */
type Language = "pt" | "en";

/** Language context type definition */
interface LanguageContextType {
    /** Current active language */
    language: Language;
    /** Function to toggle between Portuguese and English */
    toggleLanguage: () => void;
    /** Whether language has been loaded from storage */
    isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/** Storage key for persisting language */
const STORAGE_KEY = "language";

/**
 * LanguageProvider Component
 * 
 * Provides internationalization (i18n) context to the application with
 * automatic persistence to localStorage. Supports Portuguese and English.
 * 
 * @param children - Child components to wrap with language context
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // Always start with "pt" — both server and client render identically
    const [language, setLanguageState] = useState<Language>("pt");
    const [isReady, setIsReady] = useState(false);

    // After hydration, sync from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "pt" || stored === "en") {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: sync stored preference after hydration
            setLanguageState(stored);
        }
        setIsReady(true);
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguageState((prev) => {
            const newLanguage = prev === "pt" ? "en" : "pt";
            localStorage.setItem(STORAGE_KEY, newLanguage);
            return newLanguage;
        });
    }, []);

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, isReady }}>
            {children}
        </LanguageContext.Provider>
    );
}

/**
 * useLanguage Hook
 * 
 * Custom hook to access language context. Must be used within LanguageProvider.
 * 
 * @returns {LanguageContextType} Object containing current language and toggleLanguage function
 * @throws {Error} If used outside of LanguageProvider
 * 
 * @example
 * ```tsx
 * const { language, toggleLanguage } = useLanguage();
 * const t = translations[language];
 * ```
 */
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
