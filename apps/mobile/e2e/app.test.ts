import { by, device, element, waitFor } from "detox";

describe("App", () => {
  beforeAll(async () => {
    if (device.getPlatform() === "android") {
      await device.reverseTcpPort(8099);
    }
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
