'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Individual tab definition */
interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
}

/**
 * Props for AnimatedTabs component
 */
interface AnimatedTabsProps {
    /** Array of tab definitions */
    tabs: Tab[];
    /** Default active tab ID */
    defaultTab?: string;
    /** Visual variant */
    variant?: 'underline' | 'pills' | 'cards';
    /** Additional CSS classes */
    className?: string;
}

const variantStyles = {
    underline: {
        container: 'border-b border-[var(--border-color)]',
        tab: 'px-4 py-3 text-sm font-medium relative',
        indicator: 'absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary-color)]',
    },
    pills: {
        container: 'bg-[var(--bg-secondary)] rounded-xl p-1',
        tab: 'px-4 py-2 text-sm font-medium rounded-lg relative',
        indicator: 'absolute inset-0 bg-[var(--primary-color)] rounded-lg',
    },
    cards: {
        container: 'gap-2',
        tab: 'px-6 py-3 text-sm font-medium rounded-xl border-2 border-transparent relative',
        indicator: 'absolute inset-0 border-2 border-[var(--primary-color)] rounded-xl',
    },
};

/**
 * AnimatedTabs Component
 *
 * Tabbed interface with smooth animated indicator and multiple visual variants.
 * Tab buttons are centered and auto-width, content is full width below.
 *
 * @example
 * ```tsx
 * <AnimatedTabs
 *   variant="pills"
 *   tabs={[
 *     { id: 'all', label: 'Todos', content: <AllProjects /> },
 *     { id: 'web', label: 'Web', content: <WebProjects /> },
 *   ]}
 * />
 * ```
 */
export function AnimatedTabs({
    tabs,
    defaultTab,
    variant = 'underline',
    className,
}: AnimatedTabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
    const currentVariant = variantStyles[variant];

    return (
        <div className={className}>
            {/* Tab headers — centered, auto-width */}
            <div className="flex justify-center">
                <div className={cn('inline-flex', currentVariant.container)}>
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    currentVariant.tab,
                                    'transition-colors',
                                    isActive
                                        ? variant === 'pills'
                                            ? 'text-white'
                                            : 'text-[var(--text-primary)]'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                )}
                            >
                                {/* Animated indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId={`tab-indicator-${variant}`}
                                        className={cn(currentVariant.indicator, 'z-0')}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* Tab label + icon */}
                                <span className="relative z-10 flex items-center gap-2">
                                    {tab.icon}
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab content — full width */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
            >
                {tabs.find((tab) => tab.id === activeTab)?.content}
            </motion.div>
        </div>
    );
}
