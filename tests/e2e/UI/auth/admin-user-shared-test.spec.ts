import { expect, test } from "@playwright/test";
import { InventoryPage } from "../../../../src/ui/pages/saucedemo/InventoryPage";

test.describe("Scenarios shared by admin and user projects", () => {
  test("TC_AUTH_SHARED_001 authenticated session can review cart and start checkout", async ({
    page,
  }) => {
    await page.goto("/inventory.html");

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart("Sauce Labs Backpack");

    const cartPage = await inventoryPage.openCart();
    await cartPage.verifyCartPage();
    await expect(cartPage.productNames).toHaveText(["Sauce Labs Backpack"]);

    const checkoutPage = await cartPage.clickCheckout();
    await checkoutPage.verifyInformationPage();
  });
});