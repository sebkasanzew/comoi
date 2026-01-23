import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";
import baseConfig from "./base.js";

/**
 * Next.js ESLint configuration
 * Extends base with React-specific rules
 */
export default [
  ...baseConfig,
  {
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
