import { expect, test } from "@playwright/test";

test.describe("Customer Home Page Screenshots", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("full page screenshot", async ({ page }) => {
    await expect(page).toHaveScreenshot("customer-home-full.png", {
      fullPage: true,
    });
  });

  test("header section screenshot", async ({ page }) => {
    const header = page.locator("header").first();
    await expect(header).toHaveScreenshot("customer-home-header.png");
  });

  test("category grid screenshot", async ({ page }) => {
    const categorySection = page.locator("section").first();
    await expect(categorySection).toHaveScreenshot("customer-home-categories.png");
  });

  test("bottom navigation screenshot", async ({ page }) => {
    const nav = page.locator("nav").last();
    await expect(nav).toHaveScreenshot("customer-home-bottom-nav.png");
  });
});

test.describe("Customer Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays the header with location and cart", async ({ page }) => {
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByText("Giao đến")).toBeVisible();
    await expect(page.locator('a[href="/cart"]').first()).toBeVisible();
  });

  test("displays the search input", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Tìm"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute("placeholder", /Tìm gạo, thịt, rau/);
  });

  test("displays category grid", async ({ page }) => {
    const categorySection = page.locator("section").first();
    await expect(categorySection).toBeVisible();
    const categoryGrid = page.locator(".grid.grid-cols-4").first();
    await expect(categoryGrid).toBeVisible();
  });

  test("displays nearby vendors section", async ({ page }) => {
    await expect(page.getByText("Chợ gần bạn")).toBeVisible();
    const viewAllLink = page.getByText("Xem tất cả").first();
    await expect(viewAllLink).toBeVisible();
  });

  test("displays popular products section", async ({ page }) => {
    await expect(page.getByText("Sản phẩm phổ biến")).toBeVisible();
  });

  test("displays bottom navigation", async ({ page }) => {
    const nav = page.locator("nav").last();
    await expect(nav).toBeVisible();
    await expect(page.getByText("Trang chủ")).toBeVisible();
    await expect(page.getByText("Tìm kiếm")).toBeVisible();
    await expect(page.getByText("Giỏ hàng")).toBeVisible();
    await expect(page.getByText("Đơn hàng")).toBeVisible();
  });

  test("can navigate to cart", async ({ page }) => {
    await page.locator('a[href="/cart"]').first().click();
    await expect(page).toHaveURL("/cart");
  });
});
