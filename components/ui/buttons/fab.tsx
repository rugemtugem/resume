'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Props for FAB (Floating Action Button) component
 */
export interface FABProps {
    /** Icon element to display */
    icon: React.ReactNode;
    /** Accessible label for the button */
    ariaLabel: string;
    /** Click handler */
    onClick?: () => void;
    /** Optional href to make it a link */
    href?: string;
    /** Tooltip text shown on hover */
    tooltip?: string;
    /** Whether to hide FAB when scrolling down */
    hideOnScroll?: boolean;
    /** Screen position */
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    /** Color variant */
    variant?: 'primary' | 'whatsapp' | 'custom';
    /** Custom background color (for variant='custom') */
    customColor?: string;
    /** Whether to show pulse animation */
    pulse?: boolean;
    /** FAB size */
    size?: 'md' | 'lg';
}

/** Position classes mapping */
const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
};

/** Size classes mapping */
const sizeClasses = {
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
};

/** Variant color classes */
const variantClasses = {
    primary: 'bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)]',
    whatsapp: 'bg-gradient-to-br from-[#25D366] to-[#128C7E]',
    custom: ''
};

/**
 * FAB (Floating Action Button) Component
 * 
 * Fixed position button for important quick actions like WhatsApp contact
 * or scroll-to-top. Features pulse animation and smart scroll hiding.
 * 
 * Features:
 * - Position options (corners)
 * - Pulse animation rings
 * - Tooltip on hover
 * - Hide on scroll down
 * - Color variants (primary, WhatsApp, custom)
 * - Smooth enter/exit animations
 * - WCAG AA accessible
 * 
 * @example
 * ```tsx
 * <FAB
 *   icon={<FaWhatsapp className="w-6 h-6" />}
 *   ariaLabel="Contato via WhatsApp"
 *   href="https://wa.me/5511986514401"
 *   tooltip="Fale conosco"
 *   variant="whatsapp"
 *   hideOnScroll
 * />
 * ```
 */
export function FAB({
    icon,
    ariaLabel,
    onClick,
    href,
    tooltip,
    hideOnScroll = false,
    position = 'bottom-right',
    variant = 'primary',
    customColor,
    pulse = true,
    size = 'lg'
}: FABProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        if (!hideOnScroll) return;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 100) {
                // Always show near top
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
                // Scrolling down past threshold
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, hideOnScroll]);

    const fabContent = (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative group"
        >
            {/* Main button */}
            <div
                className={cn(
                    // Size
                    sizeClasses[size],
                    'rounded-full',

                    // Color
                    variantClasses[variant],

                    // Text
                    'text-white',

                    // Shadow
                    'shadow-2xl',
                    'hover:shadow-[0_0_40px_rgba(37,211,102,0.6)]',

                    // Layout
                    'flex items-center justify-center',
                    'transition-shadow duration-300'
                )}
                style={variant === 'custom' && customColor ? { backgroundColor: customColor } : undefined}
            >
                {icon}
            </div>

            {/* Pulse rings */}
            {pulse && (
                <>
                    <span
                        className={cn(
                            'absolute inset-0 rounded-full',
                            variant === 'whatsapp' ? 'bg-[#25D366]' : 'bg-[var(--primary-color)]',
                            'animate-ping opacity-20'
                        )}
                        aria-hidden="true"
                    />
                    <span
                        className={cn(
                            'absolute inset-0 rounded-full',
                            variant === 'whatsapp' ? 'bg-[#25D366]' : 'bg-[var(--primary-color)]',
                            'animate-pulse opacity-30'
                        )}
                        aria-hidden="true"
                    />
                </>
            )}

            {/* Tooltip */}
            {tooltip && (
                <div
                    className={cn(
                        'absolute top-1/2 -translate-y-1/2',
                        position.includes('right') ? 'right-16' : 'left-16',

                        // Styles
                        'px-3 py-2 rounded-lg',
                        'bg-[var(--bg-primary)] text-[var(--text-primary)]',
                        'border border-[var(--border-color)]',
                        'shadow-xl whitespace-nowrap',
                        'text-sm font-medium',

                        // Visibility
                        'opacity-0 group-hover:opacity-100',
                        'transition-opacity duration-300',
                        'pointer-events-none'
                    )}
                    role="tooltip"
                >
                    {tooltip}

                    {/* Arrow */}
                    <div
                        className={cn(
                            'absolute top-1/2 -translate-y-1/2',
                            position.includes('right') ? '-right-1.5' : '-left-1.5',
                            'w-3 h-3 rotate-45',
                            'bg-[var(--bg-primary)]',
                            position.includes('right')
                                ? 'border-r border-t border-[var(--border-color)]'
                                : 'border-l border-b border-[var(--border-color)]'
                        )}
                        aria-hidden="true"
                    />
                </div>
            )}
        </motion.div>
    );

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={cn('fixed z-50', positionClasses[position])}
                >
                    {href ? (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={ariaLabel}
                            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-2 rounded-full"
                        >
                            {fabContent}
                        </a>
                    ) : (
                        <button
                            onClick={onClick}
                            aria-label={ariaLabel}
                            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-2 rounded-full"
                        >
                            {fabContent}
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
