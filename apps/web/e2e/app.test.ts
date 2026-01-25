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

  test("should display navigation buttons", async ({ page }) => {
    await page.goto("/");

    // Verify the Browse Products link is visible
    await expect(page.getByRole("link", { name: "Browse Products" })).toBeVisible();

    // Verify the For Vendors link is visible
    await expect(page.getByRole("link", { name: "For Vendors" })).toBeVisible();
  });

  test("should show sign in/sign up buttons when unauthenticated", async ({ page }) => {
    await page.goto("/");

    // Verify auth buttons are visible
    await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();
  });
});

test.describe("Vendor Dashboard", () => {
  test("should redirect unauthenticated users to sign in", async ({ page }) => {
    await page.goto("/vendor");

    // Should show vendor sign-in prompt
    await expect(page.getByRole("heading", { name: "Comoi Vendor Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Register Your Store" })).toBeVisible();
  });
});
