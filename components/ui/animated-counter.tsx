'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'framer-motion';

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
 * Interval-animated number counter that smoothly counts up to the target value.
 */
export function AnimatedCounter({
    value,
    suffix = '',
    prefix = '',
    decimals = 0,
    className,
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px" });

    useEffect(() => {
        if (!isInView) return;

        let start = 0;
        const duration = 2000;
        const end = value;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value, isInView]);

    const display = prefix + count.toFixed(decimals) + suffix;

    return (
        <span ref={ref} className={cn('tabular-nums inline-block', className)}>
            {display}
        </span>
    );
}
