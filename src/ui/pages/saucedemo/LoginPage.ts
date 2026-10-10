import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "../BasePage";
import { InventoryPage } from "./InventoryPage";

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorDismissButton: Locator;

  constructor(page: Page) {
    super(page);
    //locators initialization
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorDismissButton = page.locator('[data-test="error-button"]');
  }

  //   async navigate(path: string ='https://www.saucedemo.com/'): Promise<void> {
  //     await super.navigate(path);
  // }
  async navigateToLogin(): Promise<void> {
    await this.navigate("/");
  }
  //enter username
  async enterUsername(username: string): Promise<void> {
    await super.waitAndFill(this.usernameInput, username);
  }
  //enter password
  async enterPassword(password: string): Promise<void> {
    await super.waitAndFill(this.passwordInput, password);
  }
  //click login buton
  async clickLoginButton(): Promise<void> {
    await super.waitAndClick(this.loginButton);
  }

  async isLoginFormVisible(): Promise<boolean> {
    return (
      (await this.usernameInput.isVisible()) &&
      (await this.passwordInput.isVisible()) &&
      (await this.loginButton.isVisible())
    );
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: "visible" });
    return (await this.errorMessage.textContent()) ?? "";
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  async clearForm(): Promise<void> {
    await this.clearText(this.usernameInput);
    await this.clearText(this.passwordInput);
  }

  async dismissError(): Promise<void> {
    await super.waitAndClick(this.errorDismissButton);
    await this.errorMessage.waitFor({ state: "hidden" });
  }

  async clickLogin(): Promise<void> {
    await this.clickLoginButton();
  }

  //login method
  async login(username: string, password: string): Promise<InventoryPage> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    return new InventoryPage(this.page);
  }
}
