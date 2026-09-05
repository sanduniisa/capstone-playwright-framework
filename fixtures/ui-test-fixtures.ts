import { test as base, expect } from "@playwright/test";
import { LoginPage, InventoryPage } from "../src/ui/pages";

//fixture types

type UIAutomationFixtures = {
  //1. login page instance
  loginPageFixture: LoginPage;

  //2. Inventory page with login step
  inventoryPageFixture: InventoryPage;

  //3. Inventory page with multiple products added to the cart
  inventoryPageWithProductsFixture: InventoryPage;
};

//user login test credentials

const CREDENTIALS = {
  standard: {
    username: "standard_user",
    password: "secret_sauce",
  },
  locked: {
    username: "locked_out_user",
    password: "secret_sauce",
  },
  problem: {
    username: "problem_user",
    password: "secret_sauce",
  },
  performance: {
    username: "performance_glitch_user",
    password: "secret_sauce",
  },
};

//custom test with fixtures

export const test = base.extend<UIAutomationFixtures>({
  //login page fixture
  /**
   * Provides a LoginPage instance
   * No automatic login - use for testing login functionality
   */
  loginPageFixture: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(loginPage);
  },

  // ==========================================
  // INVENTORY PAGE FIXTURE
  // ==========================================

  /**
   * Provides an InventoryPage instance with automatic login
   * User is logged in as 'standard_user' before the test runs
   */
  inventoryPageFixture: async ({ page }, use) => {
    //setup : create page objects
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    //setup : Login
    await loginPage.navigate();
    await loginPage.login(
      CREDENTIALS.standard.username,
      CREDENTIALS.standard.password,
    );
    //wait for inventory page to load
    await page.waitForURL(/inventory\.html/);
    //provide fixture to test
    await use(inventoryPage);
  },
  //Inventory page with multiple products added to the cart fixture
  /**
   * Provides an InventoryPage instance with multiple products added to the cart
   * User is logged in as 'standard_user' and several products are added to the cart before the test runs
   */
  inventoryPageWithProductsFixture: async ({ page }, use) => {
    //setup : create page objects
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    //setup : Login
    await loginPage.navigate();
    await loginPage.login(
      CREDENTIALS.standard.username,
      CREDENTIALS.standard.password,
    );
    //wait for inventory page to load
    await page.waitForURL(/inventory\.html/);
    //setup : add multiple products to the cart
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.addProductToCart("Sauce Labs Bike Light");
    await inventoryPage.addProductToCart("Sauce Labs Bolt T-Shirt");
    //provide fixture to test
    await use(inventoryPage);
  },
});
export { expect };
export { CREDENTIALS };
