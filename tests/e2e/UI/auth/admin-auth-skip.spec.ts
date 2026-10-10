import { expect, test } from "@playwright/test";

test.describe("Skipping saved authentication for specific tests", () => {
  test.use({
    // Start with empty state - no cookies, no localStorage.
    storageState: { cookies: [], origins: [] },
  });

  test("TC_AUTH_SKIP_001 specific tests can bypass saved auth", async ({ page }) => {
    await page.goto("/inventory.html");

    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});