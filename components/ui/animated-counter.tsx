'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for AnimatedCounter component
 */
interface AnimatedCounterProps {
    /** Target counter value */
    value: number;
    /** Suffix text (e.g. "+", "%") */
    suffix?: string;
    /** Prefix text (e.g. "$", "#") */
    prefix?: string;
    /** Number of decimal places */
    decimals?: number;
    /** Additional CSS classes */
    className?: string;
}

/**
 * AnimatedCounter Component
 *
 * Spring-animated number counter that smoothly counts up to the target value.
 *
 * @example
 * ```tsx
 * <AnimatedCounter value={1000} suffix="+" />
 * <AnimatedCounter value={99.9} suffix="%" decimals={1} />
 * ```
 */
export function AnimatedCounter({
    value,
    suffix = '',
    prefix = '',
    decimals = 0,
    className,
}: AnimatedCounterProps) {
    const spring = useSpring(0, { stiffness: 100, damping: 30 });
    const display = useTransform(spring, (current) =>
        prefix + current.toFixed(decimals) + suffix
    );

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span className={cn('tabular-nums', className)}>{display}</motion.span>;
}
