"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CodeWindowProps {
    fileName?: string;
    children: ReactNode;
    className?: string;
    language?: string;
}

export function CodeWindow({
    fileName = "code.js",
    children,
    className,
    language = "javascript",
}: CodeWindowProps) {
    return (
        <div
            className={cn(
                "rounded-lg overflow-hidden border border-border bg-[#1e1e1e]",
                className
            )}
        >
            {/* Window Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#2d2d2d] border-b border-border">
                {/* Traffic Lights */}
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>

                {/* File Name */}
                <span className="text-sm text-muted-foreground ml-2">{fileName}</span>
            </div>

            {/* Code Content */}
            <div className="p-6">
                <pre className="text-sm overflow-x-auto">
                    <code className={`language-${language} text-foreground`}>
                        {children}
                    </code>
                </pre>
            </div>
        </div>
    );
}
