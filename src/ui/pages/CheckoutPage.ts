import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export type CheckoutInformation = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export class CheckoutPage extends BasePage {
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly overviewItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly confirmationMessage: Locator;
  readonly backHomeButton: Locator;
  readonly generatePdfOrderButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.overviewItems = page.locator('[data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.confirmationMessage = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.generatePdfOrderButton = page.getByRole("button", {name: /Generate PDF Order/i,});
  }

  async verifyInformationPage(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
    await expect(this.pageTitle).toHaveText("Checkout: Your Information");
  }

  async fillCheckoutInformation(
    checkoutInformation: CheckoutInformation,
  ): Promise<void> {
    await this.firstNameInput.fill(checkoutInformation.firstName);
    await this.lastNameInput.fill(checkoutInformation.lastName);
    await this.postalCodeInput.fill(checkoutInformation.postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
    await this.page.waitForURL(/checkout-step-two\.html/);
  }

  async verifyOverview(expectedItemCount: number): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    await expect(this.pageTitle).toHaveText("Checkout: Overview");
    await expect(this.overviewItems).toHaveCount(expectedItemCount);
    await expect(this.subtotalLabel).toBeVisible();
    await expect(this.taxLabel).toBeVisible();
    await expect(this.totalLabel).toBeVisible();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
    await this.page.waitForURL(/checkout-complete\.html/);
  }

  async verifyOrderConfirmation(): Promise<void> {
    await expect(this.pageTitle).toHaveText("Checkout: Complete!");
    await expect(this.confirmationMessage).toHaveText("Thank you for your order!");
  }

  async verifyOrderCompletion(): Promise<void> {
    await this.verifyOrderConfirmation();
    await expect(this.backHomeButton).toBeVisible();
    await expect(this.backHomeButton).toBeEnabled();
    await expect(this.generatePdfOrderButton).toBeVisible();
    await expect(this.generatePdfOrderButton).toBeEnabled();
  }
}
