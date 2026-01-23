import baseConfig from "@comoi/eslint-config/base";

export default [
  ...baseConfig,
  {
    ignores: ["convex/_generated/**"],
  },
];
