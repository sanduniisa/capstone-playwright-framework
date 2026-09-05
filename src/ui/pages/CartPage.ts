import { expect, type Page, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { InventoryPage } from "./InventoryPage";
import { CheckoutPage } from "./CheckoutPage";


export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly addedProductsCount: Locator;
  readonly productNames: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator(".title");
    this.addedProductsCount = page.locator('[data-test="inventory-item"]');
    this.productNames = page.locator('[data-test="inventory-item-name"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async verifyPageTitle(expectedTitle: string): Promise<void> {
    await this.pageTitle.waitFor({ state: "visible" });
    await expect(this.pageTitle).toHaveText(expectedTitle);
  }

  async verifyCartPage(): Promise<void> {
    await this.verifyPageTitle("Your Cart");
  }

  async getAddedProductsCount(): Promise<number> {
    return await this.addedProductsCount.count();
  }

  async getCartItemCount(): Promise<number> {
    return await this.getAddedProductsCount();
  }

  async getProductNames(): Promise<string[]> {
    return await this.productNames.allTextContents();
  }

  async clickContinueShopping(): Promise<InventoryPage> {
    await this.continueShoppingButton.click();
    await this.page.waitForURL(/inventory\.html/);
    return new InventoryPage(this.page);
  }

  async clickCheckout(): Promise<CheckoutPage> {
    await this.checkoutButton.click();
    await this.page.waitForURL(/checkout-step-one\.html/);
    return new CheckoutPage(this.page);
  }
}