/**
 * @comoi/theme - Tailwind CSS Preset
 *
 * Use this preset in your tailwind.config.ts:
 * @example
 * import comoiPreset from '@comoi/theme/tailwind';
 * export default { presets: [comoiPreset] };
 */

import { breakpoints } from "./breakpoints";
import { primitives } from "./colors";
import { durations, easings } from "./motion";
import { radii } from "./radii";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { fontFamilies, fontSizes, fontWeights, letterSpacings, lineHeights } from "./typography";
import { zIndex } from "./zIndex";

const comoiPreset = {
  theme: {
    extend: {
      colors: {
        // Primitive colors (use sparingly)
        green: primitives.green,
        neutral: primitives.neutral,
        red: primitives.red,
        yellow: primitives.yellow,
        blue: primitives.blue,

        // Semantic colors via CSS variables (for theme switching)
        background: "var(--color-background)",
        "background-surface": "var(--color-background-surface)",
        "background-elevated": "var(--color-background-elevated)",
        "background-muted": "var(--color-background-muted)",

        foreground: "var(--color-foreground)",
        "foreground-muted": "var(--color-foreground-muted)",
        "foreground-subtle": "var(--color-foreground-subtle)",
        "foreground-inverted": "var(--color-foreground-inverted)",

        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "primary-active": "var(--color-primary-active)",
        "primary-subtle": "var(--color-primary-subtle)",
        "primary-contrast": "var(--color-primary-contrast)",

        success: "var(--color-success)",
        "success-bg": "var(--color-success-background)",
        error: "var(--color-error)",
        "error-bg": "var(--color-error-background)",
        warning: "var(--color-warning)",
        "warning-bg": "var(--color-warning-background)",
        info: "var(--color-info)",
        "info-bg": "var(--color-info-background)",

        border: "var(--color-border)",
        "border-muted": "var(--color-border-muted)",
        "border-focus": "var(--color-border-focus)",
      },
      fontFamily: {
        display: fontFamilies.display,
        body: fontFamilies.body,
        mono: fontFamilies.mono,
      },
      fontSize: fontSizes,
      fontWeight: fontWeights,
      lineHeight: lineHeights,
      letterSpacing: letterSpacings,
      spacing: spacing,
      borderRadius: radii,
      boxShadow: shadows,
      transitionDuration: durations,
      transitionTimingFunction: easings,
      zIndex: zIndex,
      screens: breakpoints,
    },
  },
};

export default comoiPreset;
