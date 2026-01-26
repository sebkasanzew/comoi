import reactNativeConfig from "@comoi/eslint-config/react-native";
import type { Linter } from "eslint";

const config: Linter.Config[] = [
  ...(reactNativeConfig as unknown as Linter.Config[]),
  {
    ignores: ["plugins/**"],
  },
];

export default config;
