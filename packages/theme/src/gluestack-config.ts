/**
 * @comoi/theme - Gluestack UI Configuration
 *
 * Theme configuration for gluestack-ui v2.
 * Use this with GluestackUIProvider.
 */

import { primitives, semanticColors } from "./colors";
import { radiiPx } from "./radii";
import { shadowsRN } from "./shadows";
import { spacingPx } from "./spacing";
import { fontSizesPx, fontWeights, lineHeights } from "./typography";

/**
 * Gluestack theme tokens using NativeWind vars format
 */
export const gluestackConfig = {
  light: {
    // Colors
    "--color-background-0": semanticColors.light.background,
    "--color-background-50": semanticColors.light.backgroundMuted,
    "--color-background-100": semanticColors.light.backgroundSurface,
    "--color-background-200": semanticColors.light.backgroundElevated,

    "--color-text-0": semanticColors.light.foreground,
    "--color-text-100": semanticColors.light.foregroundMuted,
    "--color-text-200": semanticColors.light.foregroundSubtle,

    "--color-primary-0": semanticColors.light.primarySubtle,
    "--color-primary-50": primitives.green[100],
    "--color-primary-100": primitives.green[200],
    "--color-primary-200": primitives.green[300],
    "--color-primary-300": primitives.green[400],
    "--color-primary-400": primitives.green[500],
    "--color-primary-500": semanticColors.light.primary,
    "--color-primary-600": semanticColors.light.primaryHover,
    "--color-primary-700": semanticColors.light.primaryActive,

    "--color-success-500": semanticColors.light.success,
    "--color-error-500": semanticColors.light.error,
    "--color-warning-500": semanticColors.light.warning,
    "--color-info-500": semanticColors.light.info,

    "--color-border-0": semanticColors.light.borderMuted,
    "--color-border-100": semanticColors.light.border,
    "--color-border-focus": semanticColors.light.borderFocus,
  },
  dark: {
    // Colors
    "--color-background-0": semanticColors.dark.background,
    "--color-background-50": semanticColors.dark.backgroundMuted,
    "--color-background-100": semanticColors.dark.backgroundSurface,
    "--color-background-200": semanticColors.dark.backgroundElevated,

    "--color-text-0": semanticColors.dark.foreground,
    "--color-text-100": semanticColors.dark.foregroundMuted,
    "--color-text-200": semanticColors.dark.foregroundSubtle,

    "--color-primary-0": semanticColors.dark.primarySubtle,
    "--color-primary-50": "rgba(19, 236, 19, 0.2)",
    "--color-primary-100": "rgba(19, 236, 19, 0.3)",
    "--color-primary-200": "rgba(19, 236, 19, 0.4)",
    "--color-primary-300": primitives.green[400],
    "--color-primary-400": primitives.green[300],
    "--color-primary-500": semanticColors.dark.primary,
    "--color-primary-600": semanticColors.dark.primaryHover,
    "--color-primary-700": semanticColors.dark.primaryActive,

    "--color-success-500": semanticColors.dark.success,
    "--color-error-500": semanticColors.dark.error,
    "--color-warning-500": semanticColors.dark.warning,
    "--color-info-500": semanticColors.dark.info,

    "--color-border-0": semanticColors.dark.borderMuted,
    "--color-border-100": semanticColors.dark.border,
    "--color-border-focus": semanticColors.dark.borderFocus,
  },
} as const;

/**
 * Typography configuration
 */
export const typographyConfig = {
  fontSizes: fontSizesPx,
  fontWeights,
  lineHeights,
};

/**
 * Spacing configuration
 */
export const spacingConfig = spacingPx;

/**
 * Border radius configuration
 */
export const radiiConfig = radiiPx;

/**
 * Shadow configuration for React Native
 */
export const shadowConfig = shadowsRN;

export type GluestackColorMode = "light" | "dark";
