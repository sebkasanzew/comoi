import nextjsConfig from "@comoi/eslint-config/nextjs";
import type { Linter } from "eslint";

export default [
  ...nextjsConfig,
  {
    ignores: ["postcss.config.mjs"],
  },
] as Linter.Config[];
