//import {test, expect} from '@playwright/test';
import { LoginPage } from "../../../src/ui/pages/LoginPage";
import { InventoryPage } from "../../../src/ui/pages/InventoryPage";
import { test, expect } from "../../../fixtures/ui-test-fixtures";

test.describe("Inventory Page Tests", () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    // inventoryPage = new InventoryPage(page);
    // await inventoryPage.navigate('/inventory.html');
    inventoryPage = await loginPage.login("standard_user", "secret_sauce");
  });

  test("Add a product to the cart", async () => {
    const title = await inventoryPage.getTitle();
    expect(title).toBe("Swag Labs");
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
  });

  //with fixtures
  test("Add products to the cart with fixtures", async ({
    inventoryPageFixture,
  }) => {
    await inventoryPageFixture.addProductToCart("Sauce Labs Backpack");
    await inventoryPageFixture.addProductToCart("Sauce Labs Bike Light");
    await inventoryPageFixture.addProductToCart("Sauce Labs Bolt T-Shirt");
  });

  test("add multiple products to the cart and click cart", async ({
    inventoryPageWithProductsFixture,
  }) => {
    //use the inventory page from the fixture
    const inventoryPage = inventoryPageWithProductsFixture;

    //expect the page title as swag labs
    await inventoryPage.verifyTitle("Swag Labs");
    console.log('PASS: Browser title is Swag Labs');

    //vrify the inventory page title
    await expect(inventoryPage.pageTitle).toHaveText("Products");
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
    const cartPageTitle = await cartPage.pageTitle.textContent();
    expect(cartPageTitle).toBe("Your Cart");
    console.log('PASS: Cart page title is Your Cart');
  });
});
