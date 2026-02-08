"use client";

import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfiniteCarouselProps {
    children: ReactNode;
    className?: string;
}

export function InfiniteCarousel({ children, className }: InfiniteCarouselProps) {
    const [isPaused, setIsPaused] = useState(false);

    return (
        <div
            className={cn("carousel-container", className)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className={cn("carousel-track", isPaused && "paused")}>
                {children}
            </div>
        </div>
    );
}
