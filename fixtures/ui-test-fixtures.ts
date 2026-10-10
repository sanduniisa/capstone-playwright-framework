import { test as base, expect } from "@playwright/test";
import type { InventoryPage } from "../src/ui/pages/saucedemo/InventoryPage";
import type { LoginPage } from "../src/ui/pages/saucedemo/LoginPage";
import {
  CREDENTIALS,
  createInventoryPageFixture,
  createInventoryPageWithProductsFixture,
  createLoginPageFixture,
} from "../src/ui/uiFixtureSetup";

//fixture types

type UIAutomationFixtures = {
  //1. login page instance
  loginPageFixture: LoginPage;

  //2. Inventory page with login step
  inventoryPageFixture: InventoryPage;

  //3. Inventory page with multiple products added to the cart
  inventoryPageWithProductsFixture: InventoryPage;
};

//custom test with fixtures

export const test = base.extend<UIAutomationFixtures>({
  //login page fixture
  /**
   * Provides a LoginPage instance
   * No automatic login - use for testing login functionality
   */
  loginPageFixture: async ({ page }, use) => {
    await use(await createLoginPageFixture(page));
  },

  // ==========================================
  // INVENTORY PAGE FIXTURE
  // ==========================================

  /**
   * Provides an InventoryPage instance with automatic login
   * User is logged in as 'standard_user' before the test runs
   */
  inventoryPageFixture: async ({ page }, use) => {
    await use(await createInventoryPageFixture(page));
  },
  //Inventory page with multiple products added to the cart fixture
  /**
   * Provides an InventoryPage instance with multiple products added to the cart
   * User is logged in as 'standard_user' and several products are added to the cart before the test runs
   */
  inventoryPageWithProductsFixture: async ({ page }, use) => {
    await use(await createInventoryPageWithProductsFixture(page));
  },
});
export { expect };
export { CREDENTIALS };
