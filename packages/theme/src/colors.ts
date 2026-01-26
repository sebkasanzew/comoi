/**
 * @comoi/theme - Color Tokens
 *
 * Color system for Comoi grocery marketplace.
 * Based on Stitch mockups with green primary brand color.
 */

/**
 * Primitive color palette - raw color values
 * These should NOT be used directly in components
 */
export const primitives = {
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
  yellow: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
  },
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  // Comoi brand greens from Stitch mockups
  brand: {
    primary: "#13ec13", // Bright green for dark mode
    primaryDark: "#0eb50e",
    contrast: "#117a11", // Accessible text on white
    contrastDark: "#0d630d",
    backgroundLight: "#f6f8f6",
    backgroundDark: "#102210",
    cardDark: "#152815",
    surfaceDark: "#1a331a",
  },
} as const;

/**
 * Semantic color tokens - role-based color aliases
 * USE THESE in components
 */
export const semanticColors = {
  light: {
    // Backgrounds
    background: primitives.brand.backgroundLight,
    backgroundSurface: "#ffffff",
    backgroundElevated: "#ffffff",
    backgroundMuted: primitives.neutral[100],

    // Foregrounds / Text
    foreground: primitives.neutral[900],
    foregroundMuted: primitives.neutral[500],
    foregroundSubtle: primitives.neutral[400],
    foregroundInverted: "#ffffff",

    // Brand colors
    primary: primitives.green[600],
    primaryHover: primitives.green[700],
    primaryActive: primitives.green[800],
    primarySubtle: primitives.green[50],
    primaryContrast: primitives.green[700], // Accessible text on white

    // Status colors
    success: primitives.green[600],
    successBackground: primitives.green[50],
    error: primitives.red[600],
    errorBackground: primitives.red[50],
    warning: primitives.yellow[600],
    warningBackground: primitives.yellow[50],
    info: primitives.blue[600],
    infoBackground: primitives.blue[50],

    // Borders
    border: primitives.neutral[200],
    borderMuted: primitives.neutral[100],
    borderFocus: primitives.green[600],

    // Interactive states
    interactiveHover: "rgba(0, 0, 0, 0.04)",
    interactivePressed: "rgba(0, 0, 0, 0.08)",
  },

  dark: {
    // Backgrounds
    background: primitives.brand.backgroundDark,
    backgroundSurface: primitives.brand.cardDark,
    backgroundElevated: primitives.brand.surfaceDark,
    backgroundMuted: "#0d1a0d",

    // Foregrounds / Text
    foreground: "#f0fdf0",
    foregroundMuted: "#a3bca3",
    foregroundSubtle: "#6b8a6b",
    foregroundInverted: primitives.brand.backgroundDark,

    // Brand colors (brighter for dark mode)
    primary: primitives.brand.primary,
    primaryHover: "#15f515",
    primaryActive: primitives.brand.primaryDark,
    primarySubtle: "rgba(19, 236, 19, 0.15)",
    primaryContrast: primitives.brand.primary,

    // Status colors (adjusted for dark mode)
    success: primitives.green[400],
    successBackground: "rgba(34, 197, 94, 0.15)",
    error: primitives.red[400],
    errorBackground: "rgba(239, 68, 68, 0.15)",
    warning: primitives.yellow[400],
    warningBackground: "rgba(234, 179, 8, 0.15)",
    info: primitives.blue[400],
    infoBackground: "rgba(59, 130, 246, 0.15)",

    // Borders
    border: "rgba(255, 255, 255, 0.1)",
    borderMuted: "rgba(255, 255, 255, 0.05)",
    borderFocus: primitives.brand.primary,

    // Interactive states
    interactiveHover: "rgba(255, 255, 255, 0.04)",
    interactivePressed: "rgba(255, 255, 255, 0.08)",
  },
} as const;

export type SemanticColorKey = keyof typeof semanticColors.light;
export type ColorMode = "light" | "dark";
