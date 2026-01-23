/** @type {import('detox').DetoxConfig} */
const config = {
  testRunner: {
    args: {
      $0: "jest",
      config: "e2e/jest.config.js",
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  behavior: {
    init: {
      exposeGlobals: true,
    },
    launchApp: "auto",
  },
  apps: {
    "ios.debug": {
      type: "ios.app",
      binaryPath: "ios/build/Build/Products/Debug-iphonesimulator/Comoi.app",
      build:
        "cd ios && RCT_NO_LAUNCH_PACKAGER=1 xcodebuild -workspace Comoi.xcworkspace -scheme Comoi -configuration Debug -sdk iphonesimulator -derivedDataPath build -destination 'platform=iOS Simulator,name=iPhone 16 Pro,OS=18.0' CODE_SIGN_IDENTITY= CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO SKIP_BUNDLING=NO",
    },
    "ios.release": {
      type: "ios.app",
      binaryPath: "ios/build/Build/Products/Release-iphonesimulator/Comoi.app",
      build:
        "cd ios && xcodebuild -workspace Comoi.xcworkspace -scheme Comoi -configuration Release -sdk iphonesimulator -derivedDataPath build -destination 'platform=iOS Simulator,name=iPhone 16 Pro,OS=18.0' CODE_SIGN_IDENTITY= CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO",
    },
    "android.debug": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      build:
        "cd android && EXPO_USE_COMMUNITY_AUTOLINKING=1 ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug",
    },
    "android.release": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/release/app-release.apk",
      build: "cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release",
    },
  },
  devices: {
    simulator: {
      type: "ios.simulator",
      device: {
        type: "iPhone 16 Pro",
      },
    },
    attached: {
      type: "android.attached",
      device: {
        adbName: ".*",
      },
    },
    emulator: {
      type: "android.emulator",
      device: {
        avdName: "Pixel_3a_API_34",
      },
    },
  },
  configurations: {
    "ios.sim.debug": {
      device: "simulator",
      app: "ios.debug",
    },
    "ios.sim.release": {
      device: "simulator",
      app: "ios.release",
    },
    "android.att.debug": {
      device: "attached",
      app: "android.debug",
    },
    "android.att.release": {
      device: "attached",
      app: "android.release",
    },
    "android.emu.debug": {
      device: "emulator",
      app: "android.debug",
    },
    "android.emu.release": {
      device: "emulator",
      app: "android.release",
    },
  },
};

module.exports = config;
