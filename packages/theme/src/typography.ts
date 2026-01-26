/**
 * @comoi/theme - Typography Tokens
 *
 * Font system for Comoi.
 * Uses Be Vietnam Pro for excellent Vietnamese diacritics support.
 */

export const fontFamilies = {
  /** Display font for headings and UI elements */
  display: '"Be Vietnam Pro", system-ui, -apple-system, sans-serif',
  /** Body font for general text */
  body: '"Be Vietnam Pro", system-ui, -apple-system, sans-serif',
  /** Monospace font for code */
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

/**
 * Font sizes in rem units (base 16px)
 */
export const fontSizes = {
  "2xs": "0.625rem", // 10px
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
} as const;

/**
 * Font sizes in pixels (for React Native)
 */
export const fontSizesPx = {
  "2xs": 10,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
} as const;

export const fontWeights = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
} as const;

export const lineHeights = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
} as const;

export const letterSpacings = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
} as const;

export type FontSizeKey = keyof typeof fontSizes;
export type FontWeightKey = keyof typeof fontWeights;
