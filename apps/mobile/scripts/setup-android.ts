import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

// Resolve Detox version from installed package
const getDetoxVersion = () => {
  const require = createRequire(import.meta.url);
  const detoxPackageJson = require.resolve("detox/package.json", {
    paths: [process.cwd()],
  });
  const detoxPkg = JSON.parse(readFileSync(detoxPackageJson, "utf8"));
  return detoxPkg.version;
};

const DETOX_VERSION = getDetoxVersion();

const findGradleDependencyVersion = (gradle: string, group: string, artifact: string) => {
  const groupPattern = group.replace(/\./g, "\\.");
  const regex = new RegExp(`${groupPattern}:${artifact}:([^"']+)`);
  const match = gradle.match(regex);
  return match?.[1];
};

const findAndroidSdk = () => {
  if (process.env.ANDROID_HOME) return process.env.ANDROID_HOME;
  if (process.env.ANDROID_SDK_ROOT) return process.env.ANDROID_SDK_ROOT;

  const mac = join(homedir(), "Library/Android/sdk");
  if (existsSync(mac)) return mac;

  const linux = join(homedir(), "Android/Sdk");
  if (existsSync(linux)) return linux;

  const localAppData = process.env.LOCALAPPDATA;
  if (localAppData) {
    const windows = join(localAppData, "Android/Sdk");
    if (existsSync(windows)) return windows;
  }

  return undefined;
};

const ensureLocalProperties = (androidDir: string) => {
  const sdkDir = findAndroidSdk();
  if (!sdkDir) {
    console.error(
      "Android SDK not found. Set ANDROID_HOME or ANDROID_SDK_ROOT, or install the SDK to the default location."
    );
    process.exit(1);
  }

  const localPropsPath = join(androidDir, "local.properties");
  const sdkLine = `sdk.dir=${sdkDir}`;

  if (existsSync(localPropsPath)) {
    const current = readFileSync(localPropsPath, "utf8");
    if (!current.includes("sdk.dir=")) {
      writeFileSync(localPropsPath, `${current.trim()}\n${sdkLine}\n`);
    }
    return sdkDir;
  }

  writeFileSync(localPropsPath, `${sdkLine}\n`);
  return sdkDir;
};

const ensureDetoxTestRunner = (androidDir: string) => {
  const testPath = join(androidDir, "app/src/androidTest/java/com/anonymous/comoi/DetoxTest.java");

  if (!existsSync(dirname(testPath))) {
    mkdirSync(dirname(testPath), { recursive: true });
  }

  const content = `package com.anonymous.comoi;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;
import com.wix.detox.Detox;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class DetoxTest {
  @Rule
  public ActivityTestRule<MainActivity> rule = new ActivityTestRule<>(MainActivity.class, false, false);

  @Test
  public void runDetoxTests() {
    Detox.runTests(rule);
  }
}
`;

  writeFileSync(testPath, content);
};

const ensureGradleConfig = (androidDir: string) => {
  const appGradlePath = join(androidDir, "app/build.gradle");
  if (!existsSync(appGradlePath)) {
    console.error("Android app build.gradle not found. Run prebuild first.");
    process.exit(1);
  }

  let gradle = readFileSync(appGradlePath, "utf8");

  const androidXRunnerVersion =
    findGradleDependencyVersion(gradle, "androidx.test", "runner") ?? "1.5.2";
  const androidXRulesVersion =
    findGradleDependencyVersion(gradle, "androidx.test", "rules") ?? "1.5.0";
  const androidXEspressoVersion =
    findGradleDependencyVersion(gradle, "androidx.test.espresso", "espresso-core") ?? "3.5.1";

  if (!gradle.includes("debuggableVariants")) {
    gradle = gradle.replace(/react\s*\{\n/, "react {\n    debuggableVariants = []\n");
  }

  if (gradle.includes("testInstrumentationRunner")) {
    gradle = gradle.replace(
      /testInstrumentationRunner\s+"[^"]+"/g,
      'testInstrumentationRunner "com.wix.detox.DetoxJUnitRunner"'
    );
  } else {
    gradle = gradle.replace(
      /defaultConfig\s*\{\n/,
      'defaultConfig {\n        testInstrumentationRunner "com.wix.detox.DetoxJUnitRunner"\n'
    );
  }

  if (!gradle.includes("testBuildType")) {
    gradle = gradle.replace(/android\s*\{\n/, 'android {\n    testBuildType "release"\n');
  }

  const detoxDeps = [
    `androidTestImplementation("com.wix:detox:${DETOX_VERSION}")`,
    `androidTestImplementation("androidx.test:runner:${androidXRunnerVersion}")`,
    `androidTestImplementation("androidx.test:rules:${androidXRulesVersion}")`,
    `androidTestImplementation("androidx.test.espresso:espresso-core:${androidXEspressoVersion}")`,
  ];

  if (gradle.includes("com.wix:detox")) {
    gradle = gradle.replace(/com\.wix:detox:[^"']+/g, `com.wix:detox:${DETOX_VERSION}`);
  } else {
    gradle = gradle.replace(
      /dependencies\s*\{\n/,
      `dependencies {\n    ${detoxDeps.join("\n    ")}\n`
    );
  }

  writeFileSync(appGradlePath, gradle);
};

const ensureDetoxMavenRepo = (androidDir: string) => {
  const require = createRequire(import.meta.url);
  const detoxPackageJson = require.resolve("detox/package.json", {
    paths: [process.cwd()],
  });
  const detoxRoot = dirname(detoxPackageJson);
  const detoxMavenPath = join(detoxRoot, "Detox-android");

  const rootGradlePath = join(androidDir, "build.gradle");
  if (!existsSync(rootGradlePath)) {
    console.error("Android root build.gradle not found. Run prebuild first.");
    process.exit(1);
  }

  let gradle = readFileSync(rootGradlePath, "utf8");
  const repoLine = `maven { url "${detoxMavenPath}" }`;

  if (!gradle.includes(detoxMavenPath)) {
    gradle = gradle.replace(
      /allprojects\s*\{\n\s*repositories\s*\{\n/,
      `allprojects {\n  repositories {\n    ${repoLine}\n`
    );
  }

  writeFileSync(rootGradlePath, gradle);
};

const ensureNetworkSecurityConfig = (androidDir: string) => {
  const xmlDir = join(androidDir, "app/src/main/res/xml");
  const xmlPath = join(xmlDir, "network_security_config.xml");
  const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">10.0.2.2</domain>
    <domain includeSubdomains="true">localhost</domain>
  </domain-config>
</network-security-config>
`;

  if (!existsSync(xmlDir)) {
    mkdirSync(xmlDir, { recursive: true });
  }

  if (!existsSync(xmlPath)) {
    writeFileSync(xmlPath, xmlContent);
  }

  const manifestPath = join(androidDir, "app/src/main/AndroidManifest.xml");
  if (!existsSync(manifestPath)) {
    console.error("AndroidManifest.xml not found. Run prebuild first.");
    process.exit(1);
  }

  let manifest = readFileSync(manifestPath, "utf8");

  const ensureApplicationAttr = (xml: string, attr: string, value: string) =>
    xml.replace(/<application([^>]*)>/, (match, attrs) => {
      const attrRegex = new RegExp(`\\b${attr}=`);
      if (attrRegex.test(attrs)) return match;
      return `<application${attrs} ${attr}="${value}">`;
    });

  manifest = ensureApplicationAttr(manifest, "android:usesCleartextTraffic", "true");
  manifest = ensureApplicationAttr(
    manifest,
    "android:networkSecurityConfig",
    "@xml/network_security_config"
  );

  writeFileSync(manifestPath, manifest);
};

const androidDir = join(process.cwd(), "android");
if (!existsSync(androidDir)) {
  console.error("Android directory not found. Run expo prebuild first.");
  process.exit(1);
}

const sdkDir = ensureLocalProperties(androidDir);
ensureDetoxTestRunner(androidDir);
ensureGradleConfig(androidDir);
ensureDetoxMavenRepo(androidDir);
ensureNetworkSecurityConfig(androidDir);

process.env.ANDROID_HOME = sdkDir;
process.env.ANDROID_SDK_ROOT = sdkDir;
