import { test, expect } from "@playwright/test";

// Exercises the full happy path against the real backend/H2 database (not mocked),
// the same way a user would: browse -> product detail -> cart -> checkout -> confirmation.
// Each run places a real order and decrements real stock, same as manual testing would.
test("a shopper can browse, add to cart, and complete checkout", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Shop Now" })).toBeVisible();

  await page.locator(".product-card a:has-text('View Details')").first().click();
  await expect(page.locator(".product-detail-info h1")).toBeVisible();

  await page.locator(".option-group:has-text('Size') .option-pill").first().click();
  await page.locator(".option-group:has-text('Color') .option-pill").first().click();
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByText("Added to cart")).toBeVisible();

  await page.goto("/cart");
  await expect(page.locator(".cart-line")).toHaveCount(1);

  await page.goto("/checkout");
  await page.fill("#firstName", "Jane");
  await page.fill("#lastName", "Doe");
  await page.fill("#email", "jane.doe@example.com");
  await page.getByLabel("Phone number").fill("5551234567");
  await page.fill("#address", "123 Main St");
  await page.fill("#city", "Springfield");
  await page.selectOption("#country", { label: "United States" });

  await page.fill("#cardName", "Jane Doe");
  await page.fill("#cardNumber", "4242424242424242");
  await page.fill("#cardExpiry", "1230");
  await page.fill("#cardCvc", "123");

  await page.getByRole("button", { name: /Place Order/ }).click();

  await expect(page.getByText("Order Confirmed")).toBeVisible();
  await expect(page.getByText(/Order #ORD-/)).toBeVisible();

  // cart should be empty again after a successful order
  await page.goto("/cart");
  await expect(page.getByText("Your cart is empty.")).toBeVisible();
});
