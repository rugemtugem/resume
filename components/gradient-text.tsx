import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
    children: ReactNode;
    className?: string;
}

export function GradientText({ children, className }: GradientTextProps) {
    return (
        <span className={cn("text-gradient-red", className)}>
            {children}
        </span>
    );
}
