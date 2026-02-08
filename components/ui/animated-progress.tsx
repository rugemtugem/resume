'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for AnimatedProgress component
 */
interface AnimatedProgressProps {
    /** Progress value (0-100) */
    value: number;
    /** Optional label text */
    label?: string;
    /** Bar color (CSS variable or hex) */
    color?: string;
    /** Show percentage number */
    showPercentage?: boolean;
    /** Bar height variant */
    height?: 'sm' | 'md' | 'lg';
    /** Animation delay in ms */
    delay?: number;
    /** Additional CSS classes */
    className?: string;
}

const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
};

/**
 * AnimatedProgress Component
 *
 * Animated progress bar that fills after mounting with optional delay.
 * Percentage counter animates alongside the bar fill.
 *
 * @example
 * ```tsx
 * <AnimatedProgress value={85} label="React" color="var(--primary-color)" delay={200} />
 * ```
 */
export function AnimatedProgress({
    value,
    label,
    color = 'var(--primary-color)',
    showPercentage = true,
    height = 'md',
    delay = 0,
    className,
}: AnimatedProgressProps) {
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [displayValue, setDisplayValue] = useState(0);
    const [fillWidth, setFillWidth] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            // Start fill
            setFillWidth(value);

            // Start counter
            const duration = 1500;
            const steps = 60;
            const increment = value / steps;
            let current = 0;

            timerRef.current = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setDisplayValue(value);
                    if (timerRef.current) clearInterval(timerRef.current);
                } else {
                    setDisplayValue(Math.floor(current));
                }
            }, duration / steps);
        }, delay);

        return () => {
            clearTimeout(timeout);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [value, delay]);

    return (
        <div className={cn('w-full', className)}>
            {/* Label row */}
            {label && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                        {label}
                    </span>
                    {showPercentage && (
                        <span
                            className="text-sm font-bold"
                            style={{ color }}
                        >
                            {displayValue}%
                        </span>
                    )}
                </div>
            )}

            {/* Track */}
            <div
                className={cn(
                    'relative w-full rounded-full overflow-hidden',
                    'bg-[var(--bg-secondary)]',
                    heightClasses[height]
                )}
            >
                {/* Fill */}
                <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                        backgroundColor: color,
                        width: `${fillWidth}%`,
                        transition: 'width 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    }}
                >
                    {/* Inner shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent button-shimmer" />
                </div>

                {/* Glow blur */}
                <div
                    className="absolute inset-y-0 left-0 rounded-full blur-md"
                    style={{
                        backgroundColor: color,
                        opacity: 0.3,
                        width: `${fillWidth}%`,
                        transition: 'width 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    }}
                />
            </div>
        </div>
    );
}
