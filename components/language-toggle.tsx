"use client";

import { useLanguage } from "./language-provider";
import { IconButton } from "@/components/ui/buttons";
import { CircularFlag } from "@/components/ui/circular-flag-svg";

/**
 * LanguageToggle Component
 *
 * Button to toggle between Portuguese (BR) and English (US) languages.
 * Uses IconButton with outline variant and CircularFlag SVG for crisp rendering.
 */
export function LanguageToggle() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <IconButton
            icon={
                <CircularFlag
                    key={language}
                    countryCode={language === "pt" ? "us" : "br"}
                    size={20}
                />
            }
            ariaLabel={`Mudar para ${language === "pt" ? "English" : "Português"}`}
            onClick={toggleLanguage}
            variant="ghost"
            size="sm"
            tooltip={language === "pt" ? "English" : "Português"}
        />
    );
}
