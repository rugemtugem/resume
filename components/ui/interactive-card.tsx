'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Props for InteractiveCard component
 */
interface InteractiveCardProps {
    /** Card content */
    children: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Enable 3D tilt effect on mouse move */
    tilt?: boolean;
    /** Enable cursor-following glow effect */
    glow?: boolean;
    /** Enable shine sweep on hover */
    shine?: boolean;
}

/**
 * InteractiveCard Component
 *
 * Premium card with 3D tilt, cursor-following glow and shine effects.
 * Used for project cards, experience cards, and any interactive content.
 *
 * Features:
 * - 3D perspective tilt following cursor
 * - Radial glow that tracks mouse position
 * - Shine sweep animation on hover
 * - Smooth spring-based animations
 * - Hardware-accelerated transforms
 *
 * @example
 * ```tsx
 * <InteractiveCard tilt glow>
 *   <h3>Project Name</h3>
 *   <p>Description</p>
 * </InteractiveCard>
 * ```
 */
export function InteractiveCard({
    children,
    className = '',
    tilt = true,
    glow = true,
    shine = true,
}: InteractiveCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse position normalized to [-0.5, 0.5]
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring-based rotation
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
        stiffness: 300,
        damping: 30,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
        stiffness: 300,
        damping: 30,
    });

    // Glow gradient position (always computed to satisfy hooks rules)
    const glowX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
    const glowY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);
    const glowBackground = useTransform(
        [glowX, glowY],
        ([x, y]) =>
            `radial-gradient(600px circle at ${x}% ${y}%, rgba(153,42,43,0.15), transparent 40%)`
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set((e.clientX - centerX) / rect.width);
        mouseY.set((e.clientY - centerY) / rect.height);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: tilt ? rotateX : 0,
                rotateY: tilt ? rotateY : 0,
                transformStyle: 'preserve-3d',
            }}
            className={cn(
                'relative rounded-2xl overflow-hidden',
                'bg-[var(--bg-secondary)]',
                'border border-[var(--border-color)]',
                'transition-shadow duration-300',
                'hover:shadow-2xl',
                className
            )}
        >
            {/* Cursor-following glow */}
            {glow && (
                <motion.div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
                    style={{ background: glowBackground }}
                />
            )}

            {/* Shine sweep */}
            {shine && (
                <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
                    style={{
                        background:
                            'linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 60%, transparent 100%)',
                        transform: 'translateX(-100%)',
                        animation: 'shine 2s infinite',
                    }}
                />
            )}

            {/* Content with 3D depth */}
            <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
                {children}
            </div>
        </motion.div>
    );
}

