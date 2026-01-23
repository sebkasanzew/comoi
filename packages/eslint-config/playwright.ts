import playwright from "eslint-plugin-playwright";
import baseConfig from "./base.js";

/**
 * Playwright ESLint configuration
 * Extends base with Playwright-specific rules for E2E tests
 */
export default [
  ...baseConfig,
  {
    ...playwright.configs["flat/recommended"],
    files: ["**/e2e/**/*.ts", "**/e2e/**/*.tsx", "**/*.e2e.ts", "**/*.e2e.tsx"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "playwright/no-conditional-in-test": "warn",
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": "warn",
      "playwright/prefer-to-have-length": "warn",
    },
  },
];
