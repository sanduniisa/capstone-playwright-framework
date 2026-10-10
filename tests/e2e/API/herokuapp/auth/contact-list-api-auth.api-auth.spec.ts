import { test, expect } from "../../../../../fixtures/api-role-auth-fixtures";
import { createContactPayload } from "../../../../../src/utils/contactListTestHelpers";
import type { Contact } from "../../../../../src/api/ContactListAPI";
import { ContactListPage } from "../../../../../src/ui/pages/herokuapp/ContactListPage";

test.describe("Contact List API with saved authentication", () => {
  test("TC_API_AUTH_001 saved token can read contacts", async ({
    authenticatedContactAPI,
  }) => {
    const response = await authenticatedContactAPI.getContacts();

    expect(response.status()).toBe(200);
    expect(await authenticatedContactAPI.getResponseBody<Contact[]>(response)).toEqual(
      expect.any(Array),
    );
  });

  test("TC_API_AUTH_002 saved token can create and read a contact", async ({
    authenticatedContactAPI,
  }) => {
    const contactPayload = createContactPayload("API_AUTH");
    const createResponse = await authenticatedContactAPI.createContact(contactPayload);

    expect(createResponse.status()).toBe(201);

    const listResponse = await authenticatedContactAPI.getContacts();
    expect(listResponse.status()).toBe(200);
    expect(await authenticatedContactAPI.getResponseBody<Contact[]>(listResponse)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          firstName: contactPayload.firstName,
          lastName: contactPayload.lastName,
          email: contactPayload.email,
        }),
      ]),
    );
  });

  // This app uses the same bearer token as an API header and browser localStorage.
  // It does not use an authentication cookie, so the demo follows its real auth flow.
  test("TC_API_UI_AUTH_001 saved bearer token authenticates API and UI", async ({
    authenticatedContactAPI,
    contactListApiAuthToken,
    page,
  }) => {
    const apiResponse = await authenticatedContactAPI.getContacts();
    expect(apiResponse.status()).toBe(200);

    await page.goto("/");
    await page.evaluate((token) => {
      localStorage.setItem("token", token);
    }, contactListApiAuthToken);
    await page.goto("/contactList");

    const contactListPage = new ContactListPage(page);
    await contactListPage.verifyContactListPage();
  });
});