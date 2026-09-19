import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "../BasePage";
import { ContactListPage } from "./ContactListPage";
import { ContactPayload } from "../../../api/ContactListAPI";

/** Add-contact form page object for the Contact List App. */
export class AddContactPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly birthdateInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly street1Input: Locator;
  readonly cityInput: Locator;
  readonly stateProvinceInput: Locator;
  readonly postalCodeInput: Locator;
  readonly countryInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator("#firstName");
    this.lastNameInput = page.locator("#lastName");
    this.birthdateInput = page.locator("#birthdate");
    this.emailInput = page.locator("#email");
    this.phoneInput = page.locator("#phone");
    this.street1Input = page.locator("#street1");
    this.cityInput = page.locator("#city");
    this.stateProvinceInput = page.locator("#stateProvince");
    this.postalCodeInput = page.locator("#postalCode");
    this.countryInput = page.locator("#country");
    this.submitButton = page.locator('button[type="submit"][form="add-contact"]');
  }

  //fill in the add-contact form using an API-style contact payload
  async fillContactDetails(contact: ContactPayload): Promise<void> {
    await this.waitAndFill(this.firstNameInput, contact.firstName);
    await this.waitAndFill(this.lastNameInput, contact.lastName);
    await this.waitAndFill(this.birthdateInput, contact.birthdate);
    await this.waitAndFill(this.emailInput, contact.email);
    await this.waitAndFill(this.phoneInput, contact.phone);
    await this.waitAndFill(this.street1Input, contact.street1);
    await this.waitAndFill(this.cityInput, contact.city);
    await this.waitAndFill(this.stateProvinceInput, contact.stateProvince);
    await this.waitAndFill(this.postalCodeInput, contact.postalCode);
    await this.waitAndFill(this.countryInput, contact.country);
  }

  async submit(): Promise<ContactListPage> {
    await this.waitAndClick(this.submitButton);
    // Wait for the SPA route change so callers never read the list before it's ready.
    await this.page.waitForURL(/contactList/);
    return new ContactListPage(this.page);
  }
}
