/**
 * @comoi/theme - CSS Variables
 *
 * Auto-generated CSS custom properties for theming.
 * Import this file in your global CSS.
 */

import { semanticColors } from "./colors";

/**
 * Generate CSS variable string for a color mode
 */
function generateCSSVariables(colors: Record<string, string>, prefix = "--color"): string {
  return Object.entries(colors)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `  ${prefix}-${cssKey}: ${value};`;
    })
    .join("\n");
}

/**
 * Get the full CSS content with light and dark mode variables
 */
export function getCSSVariables(): string {
  const lightVars = generateCSSVariables(semanticColors.light);
  const darkVars = generateCSSVariables(semanticColors.dark);

  return `/**
 * Comoi Design System - CSS Variables
 * Auto-generated from @comoi/theme
 */

:root {
${lightVars}
}

.dark {
${darkVars}
}

@media (prefers-color-scheme: dark) {
  :root:not(.light) {
${darkVars}
  }
}
`;
}

// Pre-generated CSS content
export const cssVariables = getCSSVariables();
