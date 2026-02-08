"use client";

import { useRef, useEffect, useState, useCallback, RefObject } from 'react';

/**
 * Position offset for magnetic effect
 */
interface MagneticPosition {
    x: number;
    y: number;
}

/**
 * Options for magnetic effect behavior
 */
interface MagneticOptions {
    /** Strength multiplier for the effect (0-1, default: 0.3) */
    strength?: number;
    /** Distance threshold in pixels to activate effect (default: 100) */
    threshold?: number;
    /** Whether to apply effect only on hover (default: true) */
    onlyOnHover?: boolean;
}

/**
 * useMagnetic Hook
 * 
 * Creates a magnetic hover effect where the element subtly follows
 * the cursor position when nearby, inspired by Linear.app.
 * 
 * @param options - Configuration for the magnetic behavior
 * @returns Object containing ref to attach and current position offset
 * 
 * @example
 * ```tsx
 * const { ref, position } = useMagnetic({ strength: 0.3, threshold: 100 });
 * 
 * <motion.button
 *   ref={ref}
 *   animate={{ x: position.x, y: position.y }}
 * >
 *   Click me
 * </motion.button>
 * ```
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>({
    strength = 0.3,
    threshold = 100,
    onlyOnHover = true
}: MagneticOptions = {}): {
    ref: RefObject<T | null>;
    position: MagneticPosition;
    isInRange: boolean;
} {
    const ref = useRef<T>(null);
    const [position, setPosition] = useState<MagneticPosition>({ x: 0, y: 0 });
    const [isInRange, setIsInRange] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const resetPosition = useCallback(() => {
        setPosition({ x: 0, y: 0 });
        setIsInRange(false);
    }, []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (onlyOnHover && !isHovering) {
                resetPosition();
                return;
            }

            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

            if (distance < threshold) {
                setIsInRange(true);
                setPosition({
                    x: distanceX * strength,
                    y: distanceY * strength,
                });
            } else {
                resetPosition();
            }
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => {
            setIsHovering(false);
            resetPosition();
        };

        // Use document for mouse tracking but element for hover state
        document.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength, threshold, onlyOnHover, isHovering, resetPosition]);

    return { ref, position, isInRange };
}
