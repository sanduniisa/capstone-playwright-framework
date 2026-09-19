import { expect, type Page, type Locator } from "@playwright/test";
import { BasePage } from "../BasePage";
import { AddContactPage } from "./AddContactPage";

/** Contact list landing page object for the Contact List App. */
export class ContactListPage extends BasePage {
  readonly addContactButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addContactButton = page.locator("#add-contact");
  }

  async verifyContactListPage(): Promise<void> {
    await this.verifyUrl(/contactList/);
    await expect(this.addContactButton).toBeVisible();
  }

  async openAddContactForm(): Promise<AddContactPage> {
    await this.waitAndClick(this.addContactButton);
    await this.page.waitForURL(/addContact/);
    return new AddContactPage(this.page);
  }

  //locator for a contact row identified by its visible name text
  contactRow(name: string): Locator {
    return this.page.getByText(name);
  }
}
