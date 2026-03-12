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

// Simple syntax highlighting that avoids self-highlighting
function highlightCode(code: string): string {
    // Escape HTML first
    let highlighted = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    // We use a temporary token approach to avoid highlighting our own tags
    const tokens: { [key: string]: string } = {};
    let tokenCount = 0;

    const addToken = (content: string, className: string) => {
        const id = `___TOKEN_${tokenCount++}___`;
        tokens[id] = `<span class="token ${className}">${content}</span>`;
        return id;
    };

    // 1. Comments
    highlighted = highlighted.replace(/\/\/(.*?)$/gm, (match) => addToken(match, "comment"));

    // 2. Strings
    highlighted = highlighted.replace(/(&quot;|&#039;|`)(.*?)\1/g, (match) => addToken(match, "string"));

    // 3. Keywords
    const keywords = ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "new", "this", "import", "export", "from", "default"];
    const keywordRegex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
    highlighted = highlighted.replace(keywordRegex, (match) => addToken(match, "keyword"));

    // 4. Booleans & Null
    highlighted = highlighted.replace(/\b(true|false|null|undefined)\b/g, (match) => addToken(match, "boolean"));

    // 5. Numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, (match) => addToken(match, "number"));

    // 6. Properties
    highlighted = highlighted.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*:)/g, (match) => addToken(match, "property"));

    // Final step: replace tokens with actual HTML
    Object.keys(tokens).forEach(id => {
        highlighted = highlighted.replace(id, tokens[id]);
    });

    return highlighted;
}
