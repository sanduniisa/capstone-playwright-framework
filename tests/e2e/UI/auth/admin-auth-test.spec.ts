import { expect, test } from "@playwright/test";
import { InventoryPage } from "../../../../src/ui/pages/saucedemo/InventoryPage";

test.describe("Admin authenticated scenarios", () => {
  test("TC_AUTH_ADMIN_001 admin session opens the product inventory", async ({
    page,
  }) => {
    await page.goto("/inventory.html");

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.verifyInventoryPage();
    await expect(inventoryPage.productCard).toHaveCount(6);
  });
});