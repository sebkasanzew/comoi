import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const run = (cmd: string[], env: NodeJS.ProcessEnv = process.env) => {
  const result = Bun.spawnSync(cmd, {
    env,
    stdout: "inherit",
    stderr: "inherit",
  });

  if (result.exitCode !== 0) {
    process.exit(result.exitCode ?? 1);
  }
};

const runWithXcpretty = async (cmd: string[], env: NodeJS.ProcessEnv = process.env) => {
  // Run command and pipe through xcpretty to reduce Xcode build output if available.
  // If xcpretty isn't installed we fall back to running the command directly so CI/local runs don't fail.
  const check = Bun.spawnSync(["sh", "-c", "command -v xcpretty >/dev/null 2>&1"], {
    env,
    stdout: "inherit",
    stderr: "inherit",
  });

  const hasXcpretty = check.exitCode === 0;
  if (!hasXcpretty) {
    console.warn(
      "⚠️ 'xcpretty' not found in PATH — running build without output filtering. Install with `gem install xcpretty` to get pretty Xcode output."
    );
    const proc = Bun.spawn(cmd, { env, stdout: "inherit", stderr: "inherit" });
    await proc.exited;
    return proc.exitCode;
  }

  // We merge stderr into stdout so xcpretty can format all output
  const proc = Bun.spawn(["sh", "-c", `${cmd.join(" ")} 2>&1 | xcpretty --color`], {
    env,
    stdout: "inherit",
    stderr: "inherit",
  });

  await proc.exited;
  return proc.exitCode;
};

const runBuildWithXcpretty = async (cmd: string[], env: NodeJS.ProcessEnv = process.env) => {
  const exitCode = await runWithXcpretty(cmd, env);
  if (exitCode !== 0) {
    process.exit(exitCode ?? 1);
  }
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

const ensureAndroidSdkConfig = () => {
  const sdkDir = findAndroidSdk();
  if (!sdkDir) {
    console.error(
      "Android SDK not found. Set ANDROID_HOME or ANDROID_SDK_ROOT, or install the SDK to the default location."
    );
    process.exit(1);
  }

  const androidDir = join(process.cwd(), "android");
  const localPropsPath = join(androidDir, "local.properties");
  const sdkLine = `sdk.dir=${sdkDir}`;

  if (existsSync(localPropsPath)) {
    const current = readFileSync(localPropsPath, "utf8");
    if (current.includes("sdk.dir=")) return sdkDir;
    writeFileSync(localPropsPath, `${current.trim()}\n${sdkLine}\n`);
    return sdkDir;
  }

  writeFileSync(localPropsPath, `${sdkLine}\n`);
  return sdkDir;
};

const hasNativeProjects =
  existsSync(join(process.cwd(), "ios")) && existsSync(join(process.cwd(), "android"));

const main = async () => {
  if (!hasNativeProjects) {
    run(["bun", "run", "e2e:prebuild"]);
  }
  run(["bun", "run", "e2e:setup:android"]);

  console.log("\n📱 Building iOS app (output filtered with xcpretty)...\n");
  await runBuildWithXcpretty(["bunx", "detox", "build", "--configuration", "ios.sim.release"]);

  run(["bunx", "detox", "test", "--configuration", "ios.sim.release"]);

  const sdkDir = ensureAndroidSdkConfig();
  run(["bunx", "detox", "build", "--configuration", "android.emu.release"], {
    ...process.env,
    ANDROID_HOME: sdkDir,
    ANDROID_SDK_ROOT: sdkDir,
  });
  run(["bunx", "detox", "test", "--configuration", "android.emu.release"], {
    ...process.env,
    ANDROID_HOME: sdkDir,
    ANDROID_SDK_ROOT: sdkDir,
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
