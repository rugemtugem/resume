"use client";

import { cn } from "@/lib/utils";

interface IDECodeBlockProps {
    fileName: string;
    code: string;
    className?: string;
    showLineNumbers?: boolean;
}

export function IDECodeBlock({ fileName, code, className, showLineNumbers = true }: IDECodeBlockProps) {
    const lines = code.split('\n');

    return (
        <div className={cn("ide-window max-w-full", className)}>
            {/* Header */}
            <div className="ide-header px-3 sm:px-4">
                <div className="ide-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                </div>
                <span className="ide-filename text-xs sm:text-sm truncate">{fileName}</span>
                <span className="ide-close">×</span>
            </div>

            {/* Code Body */}
            <div className="ide-body p-4 sm:p-6 overflow-x-auto">
                <div className="flex min-w-0">
                    {/* Line Numbers */}
                    {showLineNumbers && (
                        <div className="pr-3 sm:pr-4 text-[var(--color-text-muted)] select-none border-r border-[var(--color-border)] mr-3 sm:mr-4 text-xs sm:text-sm flex-shrink-0">
                            {lines.map((_, index) => (
                                <div key={index} className="text-right">
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Code */}
                    <pre className="flex-1 min-w-0 text-xs sm:text-sm whitespace-pre-wrap break-words">
                        <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
                    </pre>
                </div>
            </div>
        </div>
    );
}

// Enhanced syntax highlighting
function highlightCode(code: string): string {
    return code
        // Keywords
        .replace(/(const|let|var|function|return|if|else|for|while|class|new|this|import|export|from|default)\b/g,
            '<span class="token keyword">$1</span>')
        // Strings
        .replace(/(['"`])((?:\\.|(?!\1).)*?)\1/g,
            '<span class="token string">$1$2$1</span>')
        // Numbers
        .replace(/\b(\d+)\b/g,
            '<span class="token number">$1</span>')
        // Booleans
        .replace(/\b(true|false|null|undefined)\b/g,
            '<span class="token boolean">$1</span>')
        // Comments
        .replace(/\/\/(.*?)$/gm,
            '<span class="token comment">//$1</span>')
        // Properties (before colon)
        .replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*:)/g,
            '<span class="token property">$1</span>');
}
