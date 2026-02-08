'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Props for NotificationBadge component
 */
interface NotificationBadgeProps {
    /** Notification count */
    count?: number;
    /** Whether to show the badge */
    show?: boolean;
    /** Maximum number to display before showing max+ */
    max?: number;
    /** Badge position relative to children */
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    /** Wrapped content */
    children: React.ReactNode;
}

const positionClasses = {
    'top-right': '-top-2 -right-2',
    'top-left': '-top-2 -left-2',
    'bottom-right': '-bottom-2 -right-2',
    'bottom-left': '-bottom-2 -left-2',
};

/**
 * NotificationBadge Component
 *
 * Animated badge overlay for notification counts.
 *
 * @example
 * ```tsx
 * <NotificationBadge count={5}>
 *   <IconButton icon={<Bell />} ariaLabel="Notificações" />
 * </NotificationBadge>
 * ```
 */
export function NotificationBadge({
    count = 0,
    show = true,
    max = 99,
    position = 'top-right',
    children,
}: NotificationBadgeProps) {
    const displayCount = count > max ? `${max}+` : count;

    return (
        <div className="relative inline-block">
            {children}

            {show && count > 0 && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={cn(
                        'absolute',
                        positionClasses[position],
                        'min-w-[20px] h-5 px-1.5',
                        'flex items-center justify-center',
                        'bg-[var(--primary-color)] text-white',
                        'text-xs font-bold rounded-full',
                        'shadow-lg'
                    )}
                >
                    {displayCount}
                    <span
                        className="absolute inset-0 rounded-full bg-[var(--primary-color)] animate-ping opacity-75"
                        aria-hidden="true"
                    />
                </motion.div>
            )}
        </div>
    );
}
