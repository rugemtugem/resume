"use client";

import { useState, useCallback, useMemo } from 'react';

/**
 * Ripple interface for tracking individual ripple animations
 */
interface Ripple {
    /** Unique identifier for the ripple */
    id: number;
    /** X position of the ripple center */
    x: number;
    /** Y position of the ripple center */
    y: number;
    /** Diameter of the ripple */
    size: number;
}

/**
 * useRipple Hook
 * 
 * Creates a ripple effect on button click, similar to Material Design.
 * Handles multiple concurrent ripples and automatic cleanup.
 * 
 * @param duration - Duration of ripple animation in ms (default: 600)
 * @returns Object containing ripples array and control functions
 * 
 * @example
 * ```tsx
 * const { ripples, addRipple, clearRipples } = useRipple();
 * 
 * <button onClick={(e) => addRipple(e)}>
 *   {ripples.map((ripple) => (
 *     <span key={ripple.id} className="ripple" />
 *   ))}
 * </button>
 * ```
 */
export function useRipple(duration = 600) {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const addRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const newRipple: Ripple = {
            id: Date.now(),
            x,
            y,
            size,
        };

        setRipples((prev) => [...prev, newRipple]);

        // Auto-cleanup after animation completes
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, duration);
    }, [duration]);

    const clearRipples = useCallback(() => {
        setRipples([]);
    }, []);

    return useMemo(() => ({
        ripples,
        addRipple,
        clearRipples
    }), [ripples, addRipple, clearRipples]);
}
