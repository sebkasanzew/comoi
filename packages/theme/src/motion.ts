/**
 * @comoi/theme - Motion/Animation Tokens
 */

/**
 * Animation durations
 */
export const durations = {
  fastest: "50ms",
  faster: "100ms",
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
  slower: "400ms",
  slowest: "500ms",
} as const;

/**
 * Animation durations in milliseconds (for React Native)
 */
export const durationsMs = {
  fastest: 50,
  faster: 100,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 400,
  slowest: 500,
} as const;

/**
 * Easing functions (CSS)
 */
export const easings = {
  linear: "linear",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  // Custom easings for spring-like animations
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;

export type DurationKey = keyof typeof durations;
export type EasingKey = keyof typeof easings;
