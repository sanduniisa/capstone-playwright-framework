import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { InventoryPage } from "./InventoryPage";

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    //locators initialization
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
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
  //login method
  async login(username: string, password: string): Promise<InventoryPage> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    return new InventoryPage(this.page);
  }
}
