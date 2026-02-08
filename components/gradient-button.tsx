"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
    ({ className, variant = "default", size = "default", children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "disabled:pointer-events-none disabled:opacity-50",
                    {
                        "gradient-red text-white hover:glow-red": variant === "default",
                        "border border-primary text-primary hover:bg-primary hover:text-white":
                            variant === "outline",
                        "h-9 px-4 text-sm": size === "sm",
                        "h-11 px-8": size === "default",
                        "h-12 px-10 text-lg": size === "lg",
                    },
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

GradientButton.displayName = "GradientButton";
