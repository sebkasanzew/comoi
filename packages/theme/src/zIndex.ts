/**
 * @comoi/theme - Z-Index Tokens
 *
 * Layering scale for consistent stacking contexts.
 */

export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 50,
  sticky: 100,
  banner: 150,
  overlay: 200,
  modal: 300,
  popover: 400,
  toast: 500,
  tooltip: 600,
} as const;

export type ZIndexKey = keyof typeof zIndex;
