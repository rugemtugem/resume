"use client";

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';
import { IconButton } from '@/components/ui/buttons';

/**
 * ThemeToggle Component
 * 
 * Button to toggle between light and dark themes.
 * Uses IconButton with glass variant for premium appearance.
 */
export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <IconButton
            icon={
                theme === 'light'
                    ? <Sun className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                    : <Moon className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
            }
            ariaLabel={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            tooltip={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
        />
    );
}
