'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/** Individual particle data */
interface Particle {
    id: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
}

/**
 * Hook to create particle effects on click events.
 *
 * @example
 * ```tsx
 * const { particles, createParticles } = useClickParticles();
 * <div onClick={createParticles} className="relative overflow-hidden">
 *   <ClickParticles particles={particles} />
 *   Click me!
 * </div>
 * ```
 */
export function useClickParticles() {
    const [particles, setParticles] = useState<Particle[]>([]);

    const createParticles = useCallback((e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newParticles = Array.from({ length: 8 }).map((_, i) => ({
            id: Date.now() + i,
            x,
            y,
            dx: (Math.random() - 0.5) * 100,
            dy: (Math.random() - 0.5) * 100,
        }));

        setParticles((prev) => [...prev, ...newParticles]);

        setTimeout(() => {
            setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
        }, 700);
    }, []);

    return { particles, createParticles };
}

/**
 * ClickParticles Component
 *
 * Renders animated particles that burst outward from click position.
 */
export function ClickParticles({ particles }: { particles: Particle[] }) {
    return (
        <>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
                    animate={{
                        x: p.x + p.dx,
                        y: p.y + p.dy,
                        scale: 0,
                        opacity: 0,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute w-2 h-2 rounded-full bg-[var(--primary-color)] pointer-events-none"
                    style={{ left: 0, top: 0 }}
                />
            ))}
        </>
    );
}
