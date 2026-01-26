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
  session: {
    server: "ws://localhost:8099",
    autoStart: true,
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
      testBinaryPath: "android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk",
      build:
        "cd android && ./gradlew :app:assembleDebug :app:assembleAndroidTest -DtestBuildType=debug",
    },
    "android.release": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/release/app-release.apk",
      testBinaryPath:
        "android/app/build/outputs/apk/androidTest/release/app-release-androidTest.apk",
      build:
        "cd android && ./gradlew :app:assembleRelease :app:assembleAndroidTest -DtestBuildType=release",
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
        avdName: "Pixel_9_Pro_XL",
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
