import { expect, type Page, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator(".title");
  }

  async verifyPageTitle(expectedTitle: string): Promise<void> {
    await this.pageTitle.waitFor({ state: "visible" });
    await expect(this.pageTitle).toHaveText(expectedTitle);
  }
}