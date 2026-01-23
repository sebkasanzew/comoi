import { by, device, element, waitFor } from "detox";

describe("App", () => {
  beforeAll(async () => {
    // Launch app with synchronization disabled for NativeWind/Tailwind apps
    await device.launchApp({
      newInstance: true,
      launchArgs: { detoxDisableSynchronization: "YES" },
    });
  });

  beforeEach(async () => {
    await device.launchApp({
      newInstance: false,
      launchArgs: { detoxDisableSynchronization: "YES" },
    });
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
