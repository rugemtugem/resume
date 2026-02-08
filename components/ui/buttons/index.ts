/**
 * Button Components Export Barrel
 * 
 * Centralized export for all button components in the design system.
 * Import from this file for cleaner imports throughout the application.
 * 
 * @example
 * ```tsx
 * import { PrimaryButton, SecondaryButton, IconButton } from '@/components/ui/buttons';
 * ```
 */

// Primary CTA Button
export { PrimaryButton } from './primary-button';
export type { PrimaryButtonProps } from './primary-button';

// Secondary CTA Button
export { SecondaryButton } from './secondary-button';
export type { SecondaryButtonProps } from './secondary-button';

// Icon Button
export { IconButton } from './icon-button';
export type { IconButtonProps } from './icon-button';

// Ghost Button
export { GhostButton } from './ghost-button';
export type { GhostButtonProps } from './ghost-button';

// Link Button
export { LinkButton } from './link-button';
export type { LinkButtonProps } from './link-button';

// Floating Action Button
export { FAB } from './fab';
export type { FABProps } from './fab';
