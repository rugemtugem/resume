'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Props for SkillBadge component
 */
interface SkillBadgeProps {
    /** Skill name */
    name: string;
    /** Optional icon element */
    icon?: React.ReactNode;
    /** Proficiency level (1-5) */
    level?: number;
    /** Accent color (CSS variable or hex) */
    color?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * SkillBadge Component
 *
 * Premium skill badge with hover animation, proficiency dots,
 * and tooltip showing skill level.
 *
 * @example
 * ```tsx
 * <SkillBadge name="React" icon={<SiReact />} level={5} />
 * ```
 */
export function SkillBadge({
    name,
    icon,
    level = 5,
    color = 'var(--primary-color)',
    className,
}: SkillBadgeProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.05, y: -5 }}
            className={cn('relative group', className)}
        >
            {/* Main badge */}
            <div
                className={cn(
                    'relative px-4 py-3 rounded-xl',
                    'bg-[var(--bg-secondary)]',
                    'border-2 border-[var(--border-color)]',
                    'hover:border-[var(--primary-color)]',
                    'transition-all duration-300',
                    'cursor-pointer overflow-hidden'
                )}
            >
                {/* Background glow */}
                <motion.div
                    className="absolute inset-0"
                    style={{ backgroundColor: color }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 0.1 : 0 }}
                    transition={{ duration: 0.3 }}
                />

                {/* Content */}
                <div className="relative z-10 flex items-center gap-2">
                    {icon && (
                        <span className="text-[var(--text-primary)] group-hover:scale-110 transition-transform duration-300">
                            {icon}
                        </span>
                    )}
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {name}
                    </span>
                </div>

                {/* Level indicator dots */}
                <div className="flex gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className={cn(
                                'w-1.5 h-1.5 rounded-full transition-colors duration-300',
                                i < level
                                    ? 'bg-[var(--primary-color)]'
                                    : 'bg-[var(--border-color)]'
                            )}
                            initial={{ scale: 1 }}
                            animate={{
                                scale: isHovered && i < level ? [1, 1.3, 1] : 1,
                            }}
                            transition={{ delay: i * 0.05, duration: 0.3 }}
                        />
                    ))}
                </div>
            </div>

            {/* Tooltip */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 10,
                }}
                className={cn(
                    'absolute -top-12 left-1/2 -translate-x-1/2',
                    'px-3 py-2 rounded-lg',
                    'bg-[var(--bg-primary)] text-[var(--text-primary)]',
                    'border border-[var(--border-color)]',
                    'shadow-xl whitespace-nowrap text-sm',
                    'pointer-events-none z-20'
                )}
            >
                Proficiência: {level}/5
                <div
                    className={cn(
                        'absolute -bottom-1 left-1/2 -translate-x-1/2',
                        'w-2 h-2 rotate-45',
                        'bg-[var(--bg-primary)] border-r border-b border-[var(--border-color)]'
                    )}
                />
            </motion.div>
        </motion.div>
    );
}
