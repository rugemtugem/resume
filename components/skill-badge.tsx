import { cn } from "@/lib/utils";

interface SkillBadgeProps {
    skill: string;
    className?: string;
}

export function SkillBadge({ skill, className }: SkillBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium",
                "bg-secondary text-secondary-foreground",
                "border border-border",
                "hover:bg-accent hover:text-accent-foreground",
                "transition-colors duration-200",
                className
            )}
        >
            {skill}
        </span>
    );
}
