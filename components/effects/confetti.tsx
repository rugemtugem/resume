'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';

/** Individual confetti piece data */
interface ConfettiPiece {
    id: number;
    x: number;
    color: string;
    rotation: number;
    scale: number;
    isCircle: boolean;
}

const COLORS = [
    'var(--primary-color)',
    'var(--secondary-color)',
    '#FFD700',
    '#FF69B4',
    '#00CED1',
];

/**
 * Generate confetti pieces with random data.
 * Called outside of render to satisfy react-hooks/purity.
 */
function generatePieces(): ConfettiPiece[] {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1000;
    return Array.from({ length: 50 }).map((_, i) => ({
        id: performance.now() + i,
        x: Math.random() * width,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        isCircle: Math.random() > 0.5,
    }));
}

/**
 * Confetti Component
 *
 * Festive confetti rain triggered by a boolean prop.
 * Ideal for form submission success or achievement unlocks.
 * The parent controls visibility via the `trigger` prop.
 *
 * @example
 * ```tsx
 * const [showConfetti, setShowConfetti] = useState(false);
 * <Confetti trigger={showConfetti} />
 * // parent sets trigger=false after ~4s to unmount
 * ```
 */
export function Confetti({ trigger }: { trigger: boolean }) {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
    const prevTrigger = useRef(false);

    const clearPieces = useCallback(() => {
        setPieces([]);
    }, []);

    useEffect(() => {
        // Only trigger on rising edge (false -> true)
        if (trigger && !prevTrigger.current) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: generate confetti on trigger
            setPieces(generatePieces());

            const timer = setTimeout(clearPieces, 3500);
            return () => clearTimeout(timer);
        }
        prevTrigger.current = trigger;
    }, [trigger, clearPieces]);

    if (pieces.length === 0) return null;

    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    return (
        <div className="fixed inset-0 pointer-events-none z-[999]" aria-hidden="true">
            <AnimatePresence>
                {pieces.map((piece) => (
                    <motion.div
                        key={piece.id}
                        initial={{
                            x: piece.x,
                            y: -20,
                            rotate: piece.rotation,
                            scale: piece.scale,
                        }}
                        animate={{
                            y: windowHeight + 100,
                            rotate: piece.rotation + 720,
                            opacity: [1, 1, 0],
                        }}
                        transition={{ duration: 3, ease: 'easeIn' }}
                        className="absolute w-3 h-3"
                        style={{
                            backgroundColor: piece.color,
                            borderRadius: piece.isCircle ? '50%' : '0',
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
