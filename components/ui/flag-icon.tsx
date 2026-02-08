'use client';

/**
 * FlagIcon Component
 *
 * Renders a country flag using the flag-icons CSS library.
 * Wraps the flag-icons `fi` class in a sized container.
 *
 * @example
 * ```tsx
 * <FlagIcon countryCode="br" size={20} />
 * <FlagIcon countryCode="us" size={24} />
 * ```
 */
interface FlagIconProps {
    /** ISO 3166-1 alpha-2 country code (lowercase) */
    countryCode: string;
    /** Size in pixels */
    size?: number;
    /** Additional CSS classes */
    className?: string;
}

export function FlagIcon({ countryCode, size = 20, className }: FlagIconProps) {
    return (
        <span
            className={`fi fi-${countryCode} ${className || ''}`}
            style={{ fontSize: `${size}px`, lineHeight: 1 }}
            aria-hidden="true"
        />
    );
}
