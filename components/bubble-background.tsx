"use client";

import { useEffect, useRef } from "react";
import { motion, SpringOptions, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * BubbleBackground Component
 * 
 * An interactive background featuring smoothly animated gradient bubbles,
 * creating a playful, dynamic, and visually engaging backdrop.
 * Based on animate-ui's bubble-background component.
 */

export type BubbleColors = {
    first?: string;
    second?: string;
    third?: string;
    fourth?: string;
    fifth?: string;
    sixth?: string;
};

export type BubbleBackgroundProps = React.ComponentProps<"div"> & {
    interactive?: boolean;
    transition?: SpringOptions;
    colors?: BubbleColors;
};

const defaultColors: BubbleColors = {
    first: "255,0,107",      // Rosa vibrante (#FF006B)
    second: "238,105,54",    // Laranja (#EE6936)
    third: "153,42,43",      // Vinho (#992A2B)
    fourth: "123,47,255",    // Roxo (#7B2FFF)
    fifth: "0,217,255",      // Ciano (#00D9FF)
    sixth: "255,107,107",    // Coral (#FF6B6B)
};

export function BubbleBackground({
    interactive = false,
    transition = { stiffness: 100, damping: 20 },
    colors = defaultColors,
    className,
    ...props
}: BubbleBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const springX = useSpring(0, transition);
    const springY = useSpring(0, transition);

    const interactiveX = useTransform(springX, [0, 1], ["0%", "100%"]);
    const interactiveY = useTransform(springY, [0, 1], ["0%", "100%"]);

    useEffect(() => {
        if (!interactive) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            springX.set(x);
            springY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [interactive, springX, springY]);

    const mergedColors = { ...defaultColors, ...colors };

    return (
        <div
            ref={containerRef}
            className={cn("relative overflow-hidden", className)}
            {...props}
        >
            {/* SVG Filter for gooey effect */}
            <svg className="hidden">
                <defs>
                    <filter id="bubble-goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                            result="goo"
                        />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>

            {/* Gradient container */}
            <div
                className="absolute inset-0"
                style={{ filter: "url(#bubble-goo) blur(40px)" }}
            >
                {/* Bubble 1 */}
                <motion.div
                    className="absolute w-[80%] h-[80%] rounded-full opacity-60 mix-blend-hard-light"
                    style={{
                        background: `radial-gradient(circle at center, rgba(${mergedColors.first}, 0.8) 0%, rgba(${mergedColors.first}, 0) 50%)`,
                        top: "10%",
                        left: "10%",
                    }}
                    animate={{
                        x: [0, 100, -50, 0],
                        y: [0, -80, 60, 0],
                        scale: [1, 1.1, 0.9, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Bubble 2 */}
                <motion.div
                    className="absolute w-[70%] h-[70%] rounded-full opacity-60 mix-blend-hard-light"
                    style={{
                        background: `radial-gradient(circle at center, rgba(${mergedColors.second}, 0.8) 0%, rgba(${mergedColors.second}, 0) 50%)`,
                        top: "20%",
                        right: "5%",
                    }}
                    animate={{
                        x: [0, -80, 40, 0],
                        y: [0, 100, -40, 0],
                        scale: [1, 0.95, 1.05, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Bubble 3 */}
                <motion.div
                    className="absolute w-[60%] h-[60%] rounded-full opacity-50 mix-blend-hard-light"
                    style={{
                        background: `radial-gradient(circle at center, rgba(${mergedColors.third}, 0.8) 0%, rgba(${mergedColors.third}, 0) 50%)`,
                        bottom: "10%",
                        left: "15%",
                    }}
                    animate={{
                        x: [0, 60, -80, 0],
                        y: [0, -60, 80, 0],
                        scale: [1, 1.15, 0.85, 1],
                    }}
                    transition={{
                        duration: 22,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Bubble 4 */}
                <motion.div
                    className="absolute w-[50%] h-[50%] rounded-full opacity-50 mix-blend-hard-light"
                    style={{
                        background: `radial-gradient(circle at center, rgba(${mergedColors.fourth}, 0.8) 0%, rgba(${mergedColors.fourth}, 0) 50%)`,
                        top: "40%",
                        left: "40%",
                    }}
                    animate={{
                        x: [0, -100, 50, 0],
                        y: [0, 50, -100, 0],
                        scale: [1, 0.9, 1.1, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Bubble 5 */}
                <motion.div
                    className="absolute w-[55%] h-[55%] rounded-full opacity-40 mix-blend-hard-light"
                    style={{
                        background: `radial-gradient(circle at center, rgba(${mergedColors.fifth}, 0.8) 0%, rgba(${mergedColors.fifth}, 0) 50%)`,
                        bottom: "25%",
                        right: "20%",
                    }}
                    animate={{
                        x: [0, 70, -90, 0],
                        y: [0, -70, 50, 0],
                        scale: [1, 1.05, 0.95, 1],
                    }}
                    transition={{
                        duration: 28,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Bubble 6 - Smaller accent */}
                <motion.div
                    className="absolute w-[40%] h-[40%] rounded-full opacity-40 mix-blend-hard-light"
                    style={{
                        background: `radial-gradient(circle at center, rgba(${mergedColors.sixth}, 0.8) 0%, rgba(${mergedColors.sixth}, 0) 50%)`,
                        top: "60%",
                        left: "5%",
                    }}
                    animate={{
                        x: [0, 50, -60, 0],
                        y: [0, -40, 70, 0],
                        scale: [1, 1.2, 0.8, 1],
                    }}
                    transition={{
                        duration: 24,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Interactive bubble that follows mouse */}
                {interactive && (
                    <motion.div
                        className="absolute w-[30%] h-[30%] rounded-full opacity-70 mix-blend-hard-light pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at center, rgba(${mergedColors.first}, 0.9) 0%, rgba(${mergedColors.first}, 0) 50%)`,
                            left: interactiveX,
                            top: interactiveY,
                            x: "-50%",
                            y: "-50%",
                        }}
                    />
                )}
            </div>
        </div>
    );
}
