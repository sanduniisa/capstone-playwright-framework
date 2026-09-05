import { test as base, expect } from "@playwright/test";
import { LoginPage, InventoryPage } from "../src/ui/pages";

//fixture types

type UIAutomationFixtures = {
  //1. login page instance
  loginPageFixture: LoginPage;

  //2. Inventory page with login step
  inventoryPageFixture: InventoryPage;
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

//login page fixture
export const test = base.extend<UIAutomationFixtures>({
  loginPageFixture: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(loginPage);
  },
  inventoryPageFixture: async ({ page }, use) => {
    //setup : create page objects
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    //setup : Login
    await loginPage.navigate();
    await loginPage.login(CREDENTIALS.standard.username,CREDENTIALS.standard.password,);
    //wait for inventory page to load
    await page.waitForURL(/inventory\.html/);
    //provide fixture to test
    await use(inventoryPage);
  },
  
});
export {expect};
export { CREDENTIALS };
