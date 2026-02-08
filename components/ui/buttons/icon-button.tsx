'use client';

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Props for IconButton component
 */
export interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
    /** Icon element to display */
    icon: React.ReactNode;
    /** Accessible label for the button */
    ariaLabel: string;
    /** Button size */
    size?: 'sm' | 'md' | 'lg';
    /** Visual variant */
    variant?: 'default' | 'glass' | 'outline' | 'ghost';
    /** Whether button is in active/selected state */
    active?: boolean;
    /** Optional tooltip text */
    tooltip?: string;
    /** Optional href to make it a link */
    href?: string;
}

/** Size classes mapping */
const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
};

/** Variant classes mapping */
const variantClasses = {
    default: `
        bg-[var(--bg-secondary)] hover:bg-[var(--primary-color)]
        text-[var(--text-secondary)] hover:text-white
        shadow-md hover:shadow-lg
    `,
    glass: `
        bg-white/10 backdrop-blur-md
        border border-white/20
        text-[var(--text-secondary)] hover:text-[var(--primary-color)]
        shadow-lg hover:shadow-xl
    `,
    outline: `
        border-2 border-[var(--border-color)]
        hover:border-[var(--primary-color)] hover:bg-[var(--primary-color)]/10
        text-[var(--text-secondary)] hover:text-[var(--primary-color)]
    `,
    ghost: `
        bg-transparent hover:bg-[var(--bg-secondary)]
        text-[var(--text-secondary)] hover:text-[var(--primary-color)]
    `
};

/**
 * IconButton Component
 * 
 * Circular button for icon-only actions like theme toggle, language switch,
 * and social media links. Features rotation and scale animations on hover.
 * 
 * Features:
 * - Multiple variants (default, glass, outline, ghost)
 * - Active state with ring indicator
 * - Hover rotation and scale
 * - Tooltip support
 * - Can be used as link (href prop)
 * - WCAG AA accessible
 * 
 * @example
 * ```tsx
 * <IconButton
 *   icon={<Sun className="w-5 h-5" />}
 *   ariaLabel="Alternar tema"
 *   variant="glass"
 *   onClick={toggleTheme}
 * />
 * ```
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    function IconButton({
        icon,
        ariaLabel,
        onClick,
        href,
        size = 'md',
        variant = 'default',
        active = false,
        tooltip,
        disabled = false,
        className,
        type = 'button',
        ...props
    }, ref) {

        const buttonContent = (
            <>
                {/* Active indicator ring */}
                {active && (
                    <motion.span
                        layoutId="icon-button-active"
                        className="absolute inset-0 rounded-full bg-[var(--primary-color)]/20"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        aria-hidden="true"
                    />
                )}

                {/* Icon */}
                <span className="relative z-10 flex items-center justify-center">
                    {icon}
                </span>

                {/* Active pulse effect */}
                {active && (
                    <span
                        className="absolute inset-0 rounded-full bg-[var(--primary-color)] animate-ping opacity-20"
                        aria-hidden="true"
                    />
                )}

                {/* Tooltip */}
                {tooltip && (
                    <span
                        className={cn(
                            'absolute top-full left-1/2 -translate-x-1/2 mt-2',
                            'px-2 py-1 rounded-md',
                            'bg-[var(--bg-primary)] text-[var(--text-primary)]',
                            'border border-[var(--border-color)]',
                            'text-xs font-medium whitespace-nowrap',
                            'opacity-0 group-hover:opacity-100',
                            'transition-opacity duration-200',
                            'pointer-events-none shadow-lg z-50'
                        )}
                        role="tooltip"
                    >
                        {tooltip}
                    </span>
                )}
            </>
        );

        const commonClasses = cn(
            // Base styles
            'group relative inline-flex items-center justify-center',
            'rounded-full',
            'transition-all duration-300 ease-out',

            // Variant
            variantClasses[variant],

            // Size
            sizeClasses[size],

            // Active state
            active && 'ring-2 ring-[var(--primary-color)] ring-offset-2 ring-offset-[var(--bg-primary)]',

            // Focus state for accessibility
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)]',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',

            // Disabled state
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',

            className
        );

        // Render as link if href provided
        if (href && !disabled) {
            return (
                <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, rotate: active ? 0 : 5 }}
                    whileTap={{ scale: 0.9 }}
                    className={commonClasses}
                    aria-label={ariaLabel}
                >
                    {buttonContent}
                </motion.a>
            );
        }

        return (
            <motion.button
                ref={ref}
                type={type}
                onClick={onClick}
                disabled={disabled}
                whileHover={!disabled ? { scale: 1.1, rotate: active ? 0 : 5 } : undefined}
                whileTap={!disabled ? { scale: 0.9 } : undefined}
                className={commonClasses}
                aria-label={ariaLabel}
                aria-pressed={active}
                {...props}
            >
                {buttonContent}
            </motion.button>
        );
    }
);
