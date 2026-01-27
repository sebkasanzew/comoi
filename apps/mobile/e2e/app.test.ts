import { by, device, element, waitFor } from "detox";

describe("App", () => {
  beforeAll(async () => {
    // Note: Port reversal for Android is now handled by Detox via reversePorts config
    // Launch app with synchronization disabled for NativeWind/Tailwind apps
    await device.launchApp({
      newInstance: true,
      launchArgs: { detoxEnableSynchronization: 0 },
    });
    await device.disableSynchronization();
  });

  it("should display welcome screen", async () => {
    await waitFor(element(by.id("welcome-screen")))
      .toBeVisible()
      .withTimeout(10000);
  });

  it("should display welcome title", async () => {
    await waitFor(element(by.id("welcome-title")))
      .toBeVisible()
      .withTimeout(10000);
  });
});
