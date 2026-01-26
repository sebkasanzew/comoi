const { withGradleProperties } = require("expo/config-plugins");

/**
 * Expo config plugin to fix duplicate native library conflicts when building
 * Android test APKs with Detox.
 *
 * This adds pickFirst directives to gradle.properties to resolve conflicts
 * with libfbjni.so and other shared libraries.
 */
const withDetoxAndroidFix = (config) => {
  return withGradleProperties(config, (config) => {
    const packagingPickFirsts = [
      "**/libfbjni.so",
      "**/libc++_shared.so",
      "**/libhermestooling.so",
      "**/libjsi.so",
      "**/libreactnative.so",
    ].join(",");

    // Remove existing pickFirsts if present
    config.modResults = config.modResults.filter(
      (item) => !(item.type === "property" && item.key === "android.packagingOptions.pickFirsts")
    );

    // Add our pickFirsts configuration
    config.modResults.push({
      type: "property",
      key: "android.packagingOptions.pickFirsts",
      value: packagingPickFirsts,
    });

    return config;
  });
};

module.exports = withDetoxAndroidFix;
