import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "../BasePage";
import { ContactListPage } from "./ContactListPage";

/** Login page object for the Contact List App. */
export class ContactListLoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.submitButton = page.locator("#submit");
  }

  async enterEmail(email: string): Promise<void> {
    await super.waitAndFill(this.emailInput, email);
  }

  async enterPassword(password: string): Promise<void> {
    await super.waitAndFill(this.passwordInput, password);
  }

  async clickSubmit(): Promise<void> {
    await super.waitAndClick(this.submitButton);
  }

  async login(email: string, password: string): Promise<ContactListPage> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSubmit();
    await this.page.waitForURL(/contactList/);
    return new ContactListPage(this.page);
  }
}
