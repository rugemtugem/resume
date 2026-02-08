import { cn } from "@/lib/utils";

interface BlurShapeProps {
    className?: string;
    color?: "primary" | "accent";
}

export function BlurShape({ className, color = "primary" }: BlurShapeProps) {
    const colorClass =
        color === "primary"
            ? "bg-primary/20"
            : "bg-accent/20";

    return (
        <div
            className={cn(
                "absolute rounded-full blur-3xl opacity-30 pointer-events-none",
                colorClass,
                className
            )}
            aria-hidden="true"
        />
    );
}
