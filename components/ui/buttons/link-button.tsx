'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Props for LinkButton component
 */
export interface LinkButtonProps {
    /** Link text content */
    children: React.ReactNode;
    /** Target URL */
    href: string;
    /** Whether link is currently active/selected */
    active?: boolean;
    /** Click handler (for preventing default and custom navigation) */
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    /** Additional CSS classes */
    className?: string;
}

/**
 * LinkButton Component
 * 
 * Styled link with animated underline effect on hover.
 * Used for navigation items in navbar and footer.
 * 
 * Features:
 * - Animated underline on hover
 * - Active state with persistent underline
 * - Active indicator dot
 * - Smooth color transitions
 * - WCAG AA accessible
 * 
 * @example
 * ```tsx
 * <LinkButton
 *   href="#about"
 *   active={activeSection === 'about'}
 *   onClick={handleNavClick}
 * >
 *   Sobre
 * </LinkButton>
 * ```
 */
export function LinkButton({
    children,
    href,
    active = false,
    onClick,
    className
}: LinkButtonProps) {
    return (
        <a
            href={href}
            onClick={onClick}
            className={cn(
                // Base styles
                'group relative inline-flex items-center',
                'px-4 py-2',
                'font-medium',
                'transition-colors duration-200',

                // Colors
                'text-[var(--text-secondary)]',
                'hover:text-[var(--primary-color)]',

                // Active state
                active && 'text-[var(--primary-color)]',

                // Focus state for accessibility
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)]',
                'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',
                'rounded-md',

                className
            )}
        >
            {children}

            {/* Animated underline */}
            <motion.span
                className={cn(
                    'absolute bottom-1 left-4 right-4 h-0.5',
                    'bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]',
                    'rounded-full'
                )}
                initial={{ scaleX: active ? 1 : 0 }}
                animate={{ scaleX: active ? 1 : 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
                style={{ originX: 0 }}
                aria-hidden="true"
            />

            {/* Active indicator dot */}
            {active && (
                <motion.span
                    layoutId="nav-active-dot"
                    className={cn(
                        'absolute -bottom-2 left-1/2',
                        'w-1.5 h-1.5 rounded-full',
                        'bg-[var(--primary-color)]'
                    )}
                    style={{ marginLeft: '-3px' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    aria-hidden="true"
                />
            )}
        </a>
    );
}
