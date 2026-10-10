import type { Page } from "@playwright/test";
import { InventoryPage } from "./pages/saucedemo/InventoryPage";
import { LoginPage } from "./pages/saucedemo/LoginPage";

export const CREDENTIALS = {
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
} as const;

export const FIXTURE_CART_PRODUCTS = [
  "Sauce Labs Backpack",
  "Sauce Labs Bike Light",
  "Sauce Labs Bolt T-Shirt",
] as const;

export async function createLoginPageFixture(page: Page): Promise<LoginPage> {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLogin();
  return loginPage;
}

export async function createInventoryPageFixture(
  page: Page,
): Promise<InventoryPage> {
  const loginPage = await createLoginPageFixture(page);
  const inventoryPage = await loginPage.login(
    CREDENTIALS.standard.username,
    CREDENTIALS.standard.password,
  );
  await page.waitForURL(/inventory\.html/);
  return inventoryPage;
}

export async function createInventoryPageWithProductsFixture(
  page: Page,
): Promise<InventoryPage> {
  const inventoryPage = await createInventoryPageFixture(page);
  for (const productName of FIXTURE_CART_PRODUCTS) {
    await inventoryPage.addProductToCart(productName);
  }
  return inventoryPage;
}