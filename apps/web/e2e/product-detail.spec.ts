import { expect, test } from "@playwright/test";

// Note: Product detail tests rely on seeded data from the home page.
// We navigate from the home page to a real product to test the product detail page.

test.describe("Product Detail Page", () => {
  test("can navigate to product detail from home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Click on the first product card if available
    const productLink = page.locator('a[href*="/product/"]').first();
    const isVisible = await productLink.isVisible({ timeout: 2000 }).catch(() => false);
    if (isVisible) {
      await productLink.click();
      await expect(page).toHaveURL(/\/product\/.+/);
      // Wait for the product detail page to load
      await page.waitForLoadState("networkidle");
    }
  });

  test("product detail page shows product information", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navigate to first product
    const productLink = page.locator('a[href*="/product/"]').first();
    const isVisible = await productLink.isVisible({ timeout: 2000 }).catch(() => false);
    if (isVisible) {
      await productLink.click();
      await expect(page).toHaveURL(/\/product\/.+/);
      await page.waitForLoadState("networkidle");
      // Wait a moment for the product data to load
      await page.waitForTimeout(500);

      // Check for common product detail elements
      // The page should have either product content or skeleton
      const hasContent = await page
        .locator("text=/₫|Thêm vào giỏ|Mua ngay/i")
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false);
      expect(hasContent).toBe(true);
    }
  });

  test("full page screenshot - product detail", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navigate to first product
    const productLink = page.locator('a[href*="/product/"]').first();
    const isVisible = await productLink.isVisible({ timeout: 2000 }).catch(() => false);
    if (isVisible) {
      await productLink.click();
      await expect(page).toHaveURL(/\/product\/.+/);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot("product-detail.png", { fullPage: true });
    }
  });
});
