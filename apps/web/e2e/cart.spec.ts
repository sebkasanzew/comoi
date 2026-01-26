import { expect, test } from "@playwright/test";

test.describe("Cart Screenshots", () => {
  test("full cart page screenshot", async ({ page }) => {
    await page.goto("/cart");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("cart-full.png", { fullPage: true });
  });

  test("empty cart screenshot", async ({ page }) => {
    await page.goto("/cart");
    await page.waitForLoadState("networkidle");

    // Remove all items to get empty state
    const deleteButtons = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-trash-2") });
    const count = await deleteButtons.count();
    for (let i = 0; i < count; i++) {
      await page
        .locator("button")
        .filter({ has: page.locator("svg.lucide-trash-2") })
        .first()
        .click();
    }

    await expect(page).toHaveScreenshot("cart-empty.png", { fullPage: true });
  });
});

test.describe("Shopping Cart", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cart");
  });

  test("displays cart header", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Giỏ hàng" })).toBeVisible();
  });

  test("shows back navigation", async ({ page }) => {
    const backButton = page.locator('a[href="/"]').first();
    await expect(backButton).toBeVisible();
  });

  test("displays cart items when present", async ({ page }) => {
    // Check for vendor section with store icon
    const vendorSection = page.locator("text=Chợ Bến Thành").first();
    await expect(vendorSection).toBeVisible();
  });

  test("shows multi-vendor notice when items from different vendors", async ({ page }) => {
    const notice = page.getByText(/Đơn hàng của bạn được chia thành/);
    await expect(notice).toBeVisible();
  });

  test("shows checkout button with total", async ({ page }) => {
    const checkoutButton = page.getByRole("link", { name: /Đặt hàng/ });
    await expect(checkoutButton).toBeVisible();
  });

  test("displays total amount", async ({ page }) => {
    await expect(page.getByText("Tổng cộng")).toBeVisible();
  });

  test("can adjust item quantity", async ({ page }) => {
    const plusButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-plus") })
      .first();
    const minusButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-minus") })
      .first();
    await expect(plusButton).toBeVisible();
    await expect(minusButton).toBeVisible();
  });

  test("can remove item from cart", async ({ page }) => {
    const deleteButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-trash-2") })
      .first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    await expect(page).toHaveURL("/cart");
  });
});

test.describe("Empty Cart", () => {
  test("shows empty state when cart is empty", async ({ page }) => {
    await page.goto("/cart");

    const deleteButtons = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-trash-2") });
    const count = await deleteButtons.count();

    for (let i = 0; i < count; i++) {
      await page
        .locator("button")
        .filter({ has: page.locator("svg.lucide-trash-2") })
        .first()
        .click();
    }

    await expect(page.getByText("Giỏ hàng trống")).toBeVisible();
    await expect(page.getByText("Bắt đầu mua sắm")).toBeVisible();
  });
});
