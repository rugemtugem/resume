'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Individual accordion item definition */
interface AccordionItem {
    id: string;
    title: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
}

/**
 * Props for Accordion component
 */
interface AccordionProps {
    /** Array of accordion items */
    items: AccordionItem[];
    /** Allow multiple items open simultaneously */
    allowMultiple?: boolean;
    /** Visual variant */
    variant?: 'default' | 'bordered' | 'separated';
    /** Additional CSS classes */
    className?: string;
}

const variantClasses = {
    default: 'divide-y divide-[var(--border-color)]',
    bordered:
        'border border-[var(--border-color)] rounded-xl divide-y divide-[var(--border-color)]',
    separated: 'space-y-4',
};

/**
 * Accordion Component
 *
 * Expandable content panels with smooth height animation.
 * Supports single or multiple open items.
 *
 * @example
 * ```tsx
 * <Accordion
 *   variant="separated"
 *   items={[
 *     { id: 'faq-1', title: 'What is...?', content: <p>Answer</p> },
 *   ]}
 * />
 * ```
 */
export function Accordion({
    items,
    allowMultiple = false,
    variant = 'default',
    className,
}: AccordionProps) {
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (id: string) => {
        if (allowMultiple) {
            setOpenItems((prev) =>
                prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            );
        } else {
            setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
        }
    };

    return (
        <div className={cn(variantClasses[variant], className)}>
            {items.map((item) => {
                const isOpen = openItems.includes(item.id);

                return (
                    <div
                        key={item.id}
                        className={
                            variant === 'separated'
                                ? 'border border-[var(--border-color)] rounded-xl overflow-hidden'
                                : ''
                        }
                    >
                        {/* Header button */}
                        <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors text-left group"
                            aria-expanded={isOpen}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                {item.icon && (
                                    <span className="text-[var(--primary-color)]">{item.icon}</span>
                                )}
                                <span className="font-semibold text-[var(--text-primary)]">
                                    {item.title}
                                </span>
                            </div>

                            <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex-shrink-0 text-[var(--text-secondary)] group-hover:text-[var(--primary-color)] transition-colors"
                            >
                                <ChevronDown className="w-5 h-5" />
                            </motion.div>
                        </button>

                        {/* Collapsible content */}
                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: [0.25, 0.1, 0.25, 1.0],
                                    }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 py-4 text-[var(--text-secondary)]">
                                        {item.content}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
