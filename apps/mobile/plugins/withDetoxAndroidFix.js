const { withGradleProperties } = require("expo/config-plugins");

/**
 * Expo config plugin for Android Detox configuration:
 * 1. Fixes duplicate native library conflicts when building test APKs
 * 2. Enables build optimizations (caching, parallel builds, incremental compilation)
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

    // Properties to add or update
    const propertiesToSet = {
      // Fix duplicate library conflicts
      "android.packagingOptions.pickFirsts": packagingPickFirsts,
      // Enable build caching for faster incremental builds
      "org.gradle.caching": "true",
      // Enable parallel task execution
      "org.gradle.parallel": "true",
      // Configure JVM memory for faster builds
      "org.gradle.jvmargs": "-Xmx4g -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8",
      // Enable Kotlin incremental compilation
      "kotlin.incremental": "true",
      // Use non-transitive R classes to reduce memory usage
      "android.nonTransitiveRClass": "true",
    };

    // Remove existing properties that we want to set
    const keysToSet = Object.keys(propertiesToSet);
    config.modResults = config.modResults.filter(
      (item) => !(item.type === "property" && keysToSet.includes(item.key))
    );

    // Add our properties
    for (const [key, value] of Object.entries(propertiesToSet)) {
      config.modResults.push({
        type: "property",
        key,
        value,
      });
    }

    return config;
  });
};

module.exports = withDetoxAndroidFix;
