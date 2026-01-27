const { withDangerousMod } = require("expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

/**
 * Expo config plugin to add Detox ProGuard rules for release builds.
 * This ensures Detox classes are not stripped during R8/ProGuard optimization.
 */
const withDetoxProguardRules = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const proguardPath = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "proguard-rules.pro"
      );

      let proguardContent = "";
      if (fs.existsSync(proguardPath)) {
        proguardContent = fs.readFileSync(proguardPath, "utf-8");
      }

      // Check if Detox rules are already present
      if (proguardContent.includes("# Detox")) {
        return config;
      }

      // Detox ProGuard rules
      const detoxRules = `

# Detox
-keep class com.wix.detox.** { *; }
-keep class org.junit.** { *; }
-keep class androidx.test.** { *; }
-dontwarn com.wix.detox.**
-dontwarn org.junit.**
-dontwarn androidx.test.**

# Keep Detox instrumentation
-keep class * extends androidx.test.runner.AndroidJUnitRunner { *; }
`;

      fs.writeFileSync(proguardPath, proguardContent + detoxRules);

      return config;
    },
  ]);
};

module.exports = withDetoxProguardRules;
