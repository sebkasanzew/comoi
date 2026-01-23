import { expect, test } from "@playwright/test";

test.describe("Web App", () => {
  test("should display the homepage", async ({ page }) => {
    await page.goto("/");

    // Verify the main heading is visible
    await expect(page.getByRole("heading", { name: "Welcome to Comoi" })).toBeVisible();

    // Verify the subtitle text is present
    await expect(
      page.getByText("Grocery marketplace connecting you with local mini-markets in Vietnam.")
    ).toBeVisible();
  });

  test("should display browse products and for vendors buttons", async ({ page }) => {
    await page.goto("/");

    // Verify the Browse Products button is visible
    await expect(page.getByRole("button", { name: "Browse Products" })).toBeVisible();

    // Verify the For Vendors button is visible
    await expect(page.getByRole("button", { name: "For Vendors" })).toBeVisible();
  });
});
