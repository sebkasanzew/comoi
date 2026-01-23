import { expect, test } from "@playwright/test";

test.describe("Vendor Dashboard", () => {
  test("should display the vendor dashboard homepage", async ({ page }) => {
    await page.goto("/");

    // Verify the main heading is visible
    await expect(page.getByRole("heading", { name: "Comoi Vendor Dashboard" })).toBeVisible();

    // Verify the subtitle text is present
    await expect(page.getByText("Manage your mini-market products and orders.")).toBeVisible();
  });

  test("should display sign in and register buttons", async ({ page }) => {
    await page.goto("/");

    // Verify the Sign In button is visible
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();

    // Verify the Register Your Store button is visible
    await expect(page.getByRole("button", { name: "Register Your Store" })).toBeVisible();
  });
});
