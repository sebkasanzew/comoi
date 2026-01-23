import eslint from "@eslint/js";
import turboPlugin from "eslint-plugin-turbo";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Base ESLint configuration
 * Only contains rules NOT covered by Biome
 * Biome handles: formatting, import sorting, common lint rules
 * ESLint handles: react-hooks, TypeScript-specific rules Biome doesn't cover, turbo
 *
 * For monorepo: Each workspace's eslint.config.ts should set tsconfigRootDir
 */
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      // Turbo rules for monorepo best practices
      "turbo/no-undeclared-env-vars": "warn",
      // Rules that Biome doesn't have or handles differently
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // Disable rules that Biome handles
      "no-unused-vars": "off", // Biome handles this
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/build/**",
      "**/.expo/**",
      "**/convex/_generated/**",
      "**/*.config.js",
      "**/*.config.ts",
      "**/eslint.config.ts",
      "**/next-env.d.ts",
    ],
  }
);
