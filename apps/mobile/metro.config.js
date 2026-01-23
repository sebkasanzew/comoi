const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("node:path");
const fs = require("node:fs");

// Find the project and workspace directories
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages
// Include Bun's .bun folder structure for hoisted dependencies
const rootNodeModules = path.resolve(workspaceRoot, "node_modules");
const bunModulesPath = path.resolve(rootNodeModules, ".bun");

// Collect all Bun module paths
const bunModulePaths = [];
if (fs.existsSync(bunModulesPath)) {
  const bunDirs = fs.readdirSync(bunModulesPath);
  for (const dir of bunDirs) {
    const fullPath = path.resolve(bunModulesPath, dir, "node_modules");
    if (fs.existsSync(fullPath)) {
      bunModulePaths.push(fullPath);
    }
  }
}

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  rootNodeModules,
  ...bunModulePaths,
];

// 3. Ensure symlinked packages are resolved correctly
config.resolver.disableHierarchicalLookup = false;

// 4. Extra modules for web build resolution
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
};

module.exports = withNativeWind(config, { input: "./global.css" });
