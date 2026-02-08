"use client";

import { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface BorderLightCardProps {
    children: ReactNode;
    className?: string;
    animationSpeed?: string;
    borderRadius?: string;
    style?: CSSProperties;
}

export function BorderLightCard({
    children,
    className,
    animationSpeed = "3s",
    borderRadius = "1rem",
    style,
}: BorderLightCardProps) {
    return (
        <div
            className={cn("card-glow card-glow-active", className)}
            style={{
                ...style,
                "--card-animation-speed": animationSpeed,
                "--card-border-radius": borderRadius,
            } as CSSProperties}
        >
            <div className="card-glow-borders-masker">
                <div className="card-glow-borders"></div>
            </div>
            <div className="card-glow-animations">
                <div className="card-glow-glow"></div>
            </div>
            <div className="card-glow-content">{children}</div>
        </div>
    );
}
