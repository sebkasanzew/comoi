const { withDangerousMod } = require("expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

/**
 * Expo config plugin to fix iOS build warnings:
 * 1. Deployment target warnings for pods that specify older iOS versions
 * 2. Duplicate library warnings in OTHER_LDFLAGS
 *
 * This modifies the Podfile to add post_install hooks that fix these issues.
 */
const withIosPodfilePostInstall = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, "Podfile");

      let podfileContent = fs.readFileSync(podfilePath, "utf-8");

      // Check if our fix is already present
      if (podfileContent.includes("# Fix deployment target warnings")) {
        return config;
      }

      // The code to inject - this goes inside the post_install block
      const postInstallFix = `

    # Fix deployment target warnings for pods that specify older iOS versions
    min_ios_version = podfile_properties['ios.deploymentTarget'] || '15.1'
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        current_target = config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current_target && Gem::Version.new(current_target) < Gem::Version.new(min_ios_version)
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = min_ios_version
        end
      end
    end

    # Fix duplicate library warnings by removing duplicates from OTHER_LDFLAGS
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        ldflags = config.build_settings['OTHER_LDFLAGS']
        if ldflags.is_a?(Array)
          config.build_settings['OTHER_LDFLAGS'] = ldflags.uniq
        end
      end
    end
  end
end
`;

      // Replace the closing of post_install and target blocks with our extended version
      // The pattern is:  `  end\nend\n` at the end of the file
      const endPattern = /(\s+end\nend\n?)$/;

      if (!endPattern.test(podfileContent)) {
        console.warn("[withIosPodfilePostInstall] Could not find expected end pattern in Podfile");
        return config;
      }

      // Remove the existing end statements and append our fix (which includes the ends)
      podfileContent = podfileContent.replace(endPattern, postInstallFix);

      fs.writeFileSync(podfilePath, podfileContent);

      return config;
    },
  ]);
};

module.exports = withIosPodfilePostInstall;
