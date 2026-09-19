import { ContactListAPI } from "../../src/api/ContactListAPI";
import { Page } from "@playwright/test";
import { ContactListLoginPage, ContactListPage } from "../../src/ui/pages";
import {
  createContactPayload,
  registerAndLogin,
} from "../../src/utils/contactListTestHelpers";
import { expect } from "../../fixtures/api-fixtures";

export type ContactListScenarioContext = {
  contactAPI: ContactListAPI;
  page: Page;
};

// Combined app-level scenario dataset: includes both UI and API interactions for the same app.
export const contactListScenarios = [
  {
    id: "TC030",
    description: "API setup and UI verification",
    run: async ({ contactAPI, page }: ContactListScenarioContext) => {
      const { credentials } = await registerAndLogin(contactAPI, "TC030");

      await page.goto("/");
      const loginPage = new ContactListLoginPage(page);
      const contactListPage = await loginPage.login(credentials.email, credentials.password);

      await contactListPage.verifyContactListPage();
    },
  },
  {
    id: "TC031",
    description: "UI action and API verification",
    run: async ({ contactAPI, page }: ContactListScenarioContext) => {
      const { credentials, auth } = await registerAndLogin(contactAPI, "TC031");
      const contactPayload = createContactPayload("TC031");

      await page.goto("/");
      const loginPage = new ContactListLoginPage(page);
      const contactListPage = await loginPage.login(credentials.email, credentials.password);
      const addContactPage = await contactListPage.openAddContactForm();
      await addContactPage.fillContactDetails(contactPayload);
      const contactListAfterAdd = await addContactPage.submit();

      await contactListAfterAdd.verifyContactListPage();
      await expect(contactListAfterAdd.contactRow(contactPayload.firstName)).toBeVisible();

      const apiResponse = await contactAPI.getContacts(auth.token);
      expect(apiResponse.status()).toBe(200);

      const contacts = await contactAPI.getResponseBody(apiResponse);
      expect(contacts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            firstName: contactPayload.firstName,
            lastName: contactPayload.lastName,
            email: contactPayload.email,
          }),
        ]),
      );
    },
  },
  {
    id: "TC032",
    description: "API auth skips UI login",
    run: async ({ contactAPI, page }: ContactListScenarioContext) => {
      const { auth } = await registerAndLogin(contactAPI, "TC032");

      await page.goto("/");
      await page.evaluate((token: string) => localStorage.setItem("token", token), auth.token);
      await page.goto("/contactList");

      const contactListPage = new ContactListPage(page);
      await contactListPage.verifyContactListPage();
    },
  },
  {
    id: "TC033",
    description: "parallel API and UI checks",
    run: async ({ contactAPI, page }: ContactListScenarioContext) => {
      const { auth } = await registerAndLogin(contactAPI, "TC033");

      const [apiResponse] = await Promise.all([
        contactAPI.getContacts(auth.token),
        page.goto("/"),
      ]);

      expect(apiResponse.status()).toBe(200);
      expect(await apiResponse.json()).toEqual(expect.any(Array));
      await expect(page).toHaveTitle(/Contact List App/);
    },
  },
] as const;
