import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for Comoi Web App
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  /* Configure snapshot settings - include project name for different viewports */
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{projectName}/{arg}{ext}",
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      animations: "disabled",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    /* Mobile viewport for testing mobile-first UI */
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
