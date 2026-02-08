'use client';

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for SecondaryButton component
 */
export interface SecondaryButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
    /** Button content */
    children: React.ReactNode;
    /** Show loading spinner */
    loading?: boolean;
    /** Icon to show on the left */
    leftIcon?: React.ReactNode;
    /** Icon to show on the right */
    rightIcon?: React.ReactNode;
    /** Button size */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Make button full width */
    fullWidth?: boolean;
    /** Optional href to make it a link */
    href?: string;
}

/** Size classes mapping */
const sizeClasses = {
    sm: 'h-10 px-4 text-sm gap-1.5',
    md: 'h-12 px-6 text-base gap-2',
    lg: 'h-14 px-8 text-lg gap-2.5',
    xl: 'h-16 px-10 text-xl gap-3'
};

/**
 * SecondaryButton Component
 * 
 * Outline button with animated border gradient and fill-on-hover effect.
 * Used for secondary actions like "Ver Currículo" and "Saiba Mais".
 * 
 * Features:
 * - Gradient border animation
 * - Background fill on hover
 * - Text color transition
 * - Loading state with spinner
 * - Can be used as link (href prop)
 * - WCAG AA accessible
 * 
 * @example
 * ```tsx
 * <SecondaryButton
 *   href="/cv.pdf"
 *   rightIcon={<Download />}
 *   size="lg"
 * >
 *   Ver Currículo
 * </SecondaryButton>
 * ```
 */
export const SecondaryButton = forwardRef<HTMLButtonElement, SecondaryButtonProps>(
    function SecondaryButton({
        children,
        onClick,
        href,
        loading = false,
        disabled = false,
        leftIcon,
        rightIcon,
        size = 'md',
        fullWidth = false,
        className,
        type = 'button',
        ...props
    }, ref) {
        const isDisabled = disabled || loading;

        const content = (
            <>
                {/* Gradient border wrapper */}
                <span
                    className={cn(
                        'absolute inset-0 rounded-xl p-[2px]',
                        'bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]'
                    )}
                    aria-hidden="true"
                >
                    <span className="absolute inset-[2px] bg-[var(--bg-primary)] rounded-[10px] transition-colors duration-300 group-hover:bg-transparent" />
                </span>

                {/* Hover fill background */}
                <motion.span
                    className={cn(
                        'absolute inset-0 rounded-xl',
                        'bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]',
                        'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    )}
                    aria-hidden="true"
                />

                {/* Content */}
                <span className={cn(
                    'relative z-10 flex items-center justify-center',
                    sizeClasses[size],
                    'text-[var(--text-primary)] group-hover:text-white',
                    'transition-colors duration-300'
                )}>
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    ) : (
                        <>
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
                        </>
                    )}
                </span>
            </>
        );

        const commonClasses = cn(
            // Base styles
            'group relative inline-flex items-center justify-center',
            'font-semibold rounded-xl',
            'transition-all duration-300 ease-out',

            // Shadow
            'hover:shadow-lg',

            // Focus state for accessibility
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)]',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',

            // Disabled state
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',

            // Size container (content has size classes)
            sizeClasses[size],

            // Full width
            fullWidth && 'w-full',

            className
        );

        // Render as link if href provided
        if (href && !isDisabled) {
            return (
                <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={commonClasses}
                    aria-label={typeof children === 'string' ? children : undefined}
                >
                    {content}
                </motion.a>
            );
        }

        return (
            <motion.button
                ref={ref}
                type={type}
                onClick={onClick}
                disabled={isDisabled}
                whileHover={!isDisabled ? { scale: 1.02 } : undefined}
                whileTap={!isDisabled ? { scale: 0.98 } : undefined}
                className={commonClasses}
                {...props}
            >
                {content}
            </motion.button>
        );
    }
);
