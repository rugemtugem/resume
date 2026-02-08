'use client';

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRipple } from '@/hooks/use-ripple';

/**
 * Props for PrimaryButton component
 */
export interface PrimaryButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
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
    /** Enable ripple effect on click */
    ripple?: boolean;
    /** Enable glow effect on hover */
    glow?: boolean;
}

/** Size classes mapping */
const sizeClasses = {
    sm: 'h-10 px-4 text-sm gap-1.5',
    md: 'h-12 px-6 text-base gap-2',
    lg: 'h-14 px-8 text-lg gap-2.5',
    xl: 'h-16 px-10 text-xl gap-3'
};

/**
 * PrimaryButton Component
 * 
 * Main call-to-action button with gradient background, ripple effect,
 * glow on hover, and smooth animations. Used for primary actions like
 * "Entre em Contato" and "Enviar Mensagem".
 * 
 * Features:
 * - Animated gradient background
 * - Ripple effect on click
 * - Glow effect on hover
 * - Loading state with spinner
 * - Icon support (left/right)
 * - WCAG AA accessible
 * 
 * @example
 * ```tsx
 * <PrimaryButton
 *   onClick={handleContact}
 *   leftIcon={<Mail />}
 *   size="lg"
 * >
 *   Entre em Contato
 * </PrimaryButton>
 * ```
 */
export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
    function PrimaryButton({
        children,
        onClick,
        loading = false,
        disabled = false,
        leftIcon,
        rightIcon,
        size = 'md',
        fullWidth = false,
        ripple = true,
        glow = true,
        className,
        type = 'button',
        ...props
    }, ref) {
        const { ripples, addRipple } = useRipple();
        const isDisabled = disabled || loading;

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (isDisabled) return;

            if (ripple) {
                addRipple(e);
            }

            onClick?.(e);
        };

        return (
            <motion.button
                ref={ref}
                type={type}
                onClick={handleClick}
                disabled={isDisabled}
                whileHover={!isDisabled ? { scale: 1.02 } : undefined}
                whileTap={!isDisabled ? { scale: 0.98 } : undefined}
                className={cn(
                    // Base styles
                    'relative overflow-hidden inline-flex items-center justify-center',
                    'font-semibold rounded-xl',
                    'transition-all duration-300 ease-out',

                    // Gradient background
                    'bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]',
                    'text-white',

                    // Shadow & Glow
                    'shadow-lg',
                    glow && !isDisabled && 'hover:shadow-[0_0_30px_rgba(153,42,43,0.5)]',

                    // Focus state for accessibility
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)]',
                    'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',

                    // Disabled state
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',

                    // Size
                    sizeClasses[size],

                    // Full width
                    fullWidth && 'w-full',

                    className
                )}
                {...props}
            >
                {/* Shine effect overlay */}
                <span
                    className={cn(
                        'absolute inset-0 -translate-x-full',
                        'bg-gradient-to-r from-transparent via-white/20 to-transparent',
                        !isDisabled && 'group-hover:translate-x-full transition-transform duration-1000 ease-in-out'
                    )}
                    aria-hidden="true"
                />

                {/* Ripple effects */}
                {ripple && ripples.map((r) => (
                    <span
                        key={r.id}
                        className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
                        style={{
                            left: r.x,
                            top: r.y,
                            width: r.size,
                            height: r.size,
                        }}
                        aria-hidden="true"
                    />
                ))}

                {/* Content */}
                <span className="relative z-10 flex items-center justify-center gap-2">
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
            </motion.button>
        );
    }
);
