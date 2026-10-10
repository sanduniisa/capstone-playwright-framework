import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class BankLoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('input[value="Log In"]');
  }

  async navigate(path = "index.htm"): Promise<void> {
    await super.navigate(path);
  }

  async login(username: string, password: string): Promise<void> {
    await this.waitAndFill(this.usernameInput, username);
    await this.waitAndFill(this.passwordInput, password);
    await this.waitAndClick(this.loginButton);
  }
}