'use client';

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Props for GhostButton component
 */
export interface GhostButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
    /** Button content */
    children: React.ReactNode;
    /** Icon to show on the left */
    leftIcon?: React.ReactNode;
    /** Icon to show on the right */
    rightIcon?: React.ReactNode;
    /** Button size */
    size?: 'sm' | 'md' | 'lg';
    /** Whether button is in active state */
    active?: boolean;
}

/** Size classes mapping */
const sizeClasses = {
    sm: 'h-9 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-base gap-2',
    lg: 'h-11 px-5 text-lg gap-2'
};

/**
 * GhostButton Component
 * 
 * Transparent button with subtle background on hover.
 * Used for tertiary actions and optional interactions.
 * 
 * Features:
 * - Transparent background
 * - Subtle hover background
 * - Active state styling
 * - Icon support
 * - WCAG AA accessible
 * 
 * @example
 * ```tsx
 * <GhostButton
 *   onClick={handleCancel}
 *   leftIcon={<X />}
 * >
 *   Cancelar
 * </GhostButton>
 * ```
 */
export const GhostButton = forwardRef<HTMLButtonElement, GhostButtonProps>(
    function GhostButton({
        children,
        onClick,
        leftIcon,
        rightIcon,
        size = 'md',
        active = false,
        disabled = false,
        className,
        type = 'button',
        ...props
    }, ref) {

        return (
            <motion.button
                ref={ref}
                type={type}
                onClick={onClick}
                disabled={disabled}
                whileHover={!disabled ? { scale: 1.02 } : undefined}
                whileTap={!disabled ? { scale: 0.98 } : undefined}
                className={cn(
                    // Base styles
                    'relative inline-flex items-center justify-center',
                    'font-medium rounded-lg',
                    'transition-all duration-200 ease-out',

                    // Colors
                    'bg-transparent',
                    'text-[var(--text-secondary)]',
                    'hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]',

                    // Active state
                    active && 'bg-[var(--bg-secondary)] text-[var(--primary-color)]',

                    // Focus state for accessibility
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)]',
                    'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',

                    // Disabled state
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',

                    // Size
                    sizeClasses[size],

                    className
                )}
                {...props}
            >
                {leftIcon && (
                    <span className="flex-shrink-0" aria-hidden="true">
                        {leftIcon}
                    </span>
                )}
                <span>{children}</span>
                {rightIcon && (
                    <span className="flex-shrink-0" aria-hidden="true">
                        {rightIcon}
                    </span>
                )}
            </motion.button>
        );
    }
);
