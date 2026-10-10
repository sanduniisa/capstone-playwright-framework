import { expect, test } from "@playwright/test";
import { InventoryPage } from "../../../../src/ui/pages/saucedemo/InventoryPage";

test.describe("User authenticated scenarios", () => {
  test("TC_AUTH_USER_001 user session can add a product to the cart", async ({
    page,
  }) => {
    await page.goto("/inventory.html");

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.verifyInventoryPage();
    await inventoryPage.addProductToCart("Sauce Labs Backpack");

    await expect(inventoryPage.productCountIndicator).toHaveText("1");
  });
});