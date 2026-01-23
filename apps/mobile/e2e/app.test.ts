import { by, device, element, expect } from "detox";

describe("App", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should display welcome screen", async () => {
    await expect(element(by.text("Welcome to Comoi"))).toBeVisible();
  });

  it("should display subtitle text", async () => {
    await expect(
      element(by.text("Find and compare prices from local mini-markets in Vietnam."))
    ).toBeVisible();
  });
});
