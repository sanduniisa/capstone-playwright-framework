//import {test, expect} from '@playwright/test';
import { LoginPage } from "../../../src/ui/pages/LoginPage";
import { InventoryPage } from "../../../src/ui/pages/InventoryPage";
import { test, expect } from "../../../fixtures/ui-test-fixtures";

test.describe("Inventory Page Tests", () => {
  test("TC_003 Add a product to the cart", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    const inventoryPage = await loginPage.login("standard_user", "secret_sauce");
    const title = await inventoryPage.getTitle();
    expect(title).toBe("Swag Labs");
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
  });

  //with fixtures
  test("TC_004 Add products to the cart with fixtures", async ({
    inventoryPageFixture,
  }) => {
    await inventoryPageFixture.addProductToCart("Sauce Labs Backpack");
    await inventoryPageFixture.addProductToCart("Sauce Labs Bike Light");
    await inventoryPageFixture.addProductToCart("Sauce Labs Bolt T-Shirt");
  });

  test("TC_005 add multiple products to the cart and click cart", async ({
    inventoryPageWithProductsFixture,
  }) => {
    //use the inventory page from the fixture
    const inventoryPage = inventoryPageWithProductsFixture;

    //expect the page title as swag labs
    await inventoryPage.verifyInventoryPage();
    console.log('PASS: Browser title is Swag Labs');
    console.log('PASS: Inventory page title is Products');

    //cart badge should reflect the number of products added
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBe(3);
    console.log(`PASS: Cart product count is ${productCount}`);

    //selected products has remove buttons
    const removeButtonCount = await inventoryPage.getRemoveButtonCount();
    expect(removeButtonCount).toBe(3);
    console.log(`PASS: Remove button count is ${removeButtonCount}`);

    //click the shopping cart icon to open the cart
    const cartPage = await inventoryPage.openCart();

    //expect Your Cart page title
    await cartPage.verifyCartPage();
    console.log('PASS: Cart page title is Your Cart');
  });

  test("TC_006 add another product from the cart and checkout", async ({
    inventoryPageWithProductsFixture,
  }) => {
    const inventoryPage = inventoryPageWithProductsFixture;
    const expectedProducts = [
      "Sauce Labs Backpack",
      "Sauce Labs Bike Light",
      "Sauce Labs Bolt T-Shirt",
      "Test.allTheThings() T-Shirt (Red)",
    ];

    const cartPage = await inventoryPage.openCart();
    await cartPage.verifyCartPage();
    console.log("PASS: TC_006 opened the Your Cart page");

    const initialCartCount = await cartPage.getCartItemCount();
    expect(initialCartCount).toBe(3);
    console.log(`PASS: Initial cart item count is ${initialCartCount}`);

    await expect(cartPage.continueShoppingButton).toBeVisible();
    await expect(cartPage.continueShoppingButton).toBeEnabled();
    console.log("PASS: Continue Shopping button is visible and enabled");

    await expect(cartPage.checkoutButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeEnabled();
    console.log("PASS: Checkout button is visible and enabled");

    const inventoryPageAfterContinue = await cartPage.clickContinueShopping();
    console.log("PASS: Continued shopping and returned to the Products page");

    await inventoryPageAfterContinue.addProductToCart(
      "Test.allTheThings() T-Shirt (Red)",
    );
    console.log("PASS: Added Test.allTheThings() T-Shirt (Red)");

    const inventoryCartCount = await inventoryPageAfterContinue.getProductCount();
    expect(inventoryCartCount).toBe(4);
    console.log(`PASS: Inventory cart badge count is ${inventoryCartCount}`);

    const updatedCartPage = await inventoryPageAfterContinue.openCart();
    const finalCartCount = await updatedCartPage.getCartItemCount();
    expect(finalCartCount).toBe(4);
    console.log(`PASS: Final cart item count is ${finalCartCount}`);

    const actualProductNames = await updatedCartPage.getProductNames();
    for (const productName of expectedProducts) {
      expect(actualProductNames).toContain(productName);
      console.log(`PASS: Cart contains ${productName}`);
    }

    await expect(updatedCartPage.checkoutButton).toBeVisible();
    await expect(updatedCartPage.checkoutButton).toBeEnabled();
    console.log("PASS: Final Checkout button is visible and enabled");

    await updatedCartPage.clickCheckout();
    await expect(updatedCartPage.page).toHaveURL(/checkout-step-one\.html/);
    console.log("PASS: Checkout page opened");
  });

});
