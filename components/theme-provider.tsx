"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

/** Available theme options */
type Theme = 'light' | 'dark';

/** Theme context type definition */
interface ThemeContextType {
    /** Current active theme */
    theme: Theme;
    /** Function to toggle between light and dark themes */
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => { },
});

/**
 * ThemeProvider Component
 * 
 * Provides theme context to the application with automatic persistence
 * to localStorage and system preference detection.
 * 
 * Features:
 * - Persists theme preference to localStorage
 * - Detects system color scheme preference
 * - SSR-safe: always starts with "light" to match server render
 * - Syncs from localStorage after hydration via useEffect
 * - Updates document data-theme attribute
 * 
 * @param children - Child components to wrap with theme context
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Always start with "light" — both server and client render identically
    const [theme, setTheme] = useState<Theme>('light');

    // After hydration, sync from localStorage or system preference
    useEffect(() => {
        const stored = localStorage.getItem('theme') as Theme | null;
        let resolved: Theme;
        if (stored === 'light' || stored === 'dark') {
            resolved = stored;
        } else {
            resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: sync stored theme after hydration
        setTheme(resolved);
        document.documentElement.setAttribute('data-theme', resolved);
    }, []);

    // Apply theme changes to DOM and persist
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * useTheme Hook
 * 
 * Custom hook to access theme context. Must be used within ThemeProvider.
 * 
 * @returns {ThemeContextType} Object containing current theme and toggleTheme function
 * @throws {Error} If used outside of ThemeProvider
 * 
 * @example
 * ```tsx
 * const { theme, toggleTheme } = useTheme();
 * ```
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
