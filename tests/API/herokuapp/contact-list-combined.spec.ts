import { test, expect } from "../../../fixtures/api-fixtures";
import { Contact } from "../../../src/api/ContactListAPI";
import { ContactListLoginPage, ContactListPage } from "../../../src/ui/pages";
import {
  createContactPayload,
  registerAndLogin,
} from "../../../src/utils/contactListTestHelpers";

/**
 * Same-application API + UI scenarios.
 * The API and UI both use the Contact List App, so API-created data can be
 * verified through the browser and UI-created data can be read through API.
 */
test.describe("Contact List API and UI scenarios", () => {
  // Pattern 1: API Setup -> UI Verification.
  test("TC030 API setup and UI verification", async ({ contactAPI, page }) => {
    // API step: create credentials and authenticate without using the UI.
    const { credentials } = await registerAndLogin(contactAPI, "TC030");

    // UI step: use the same API-created credentials in the UI login.
    await page.goto("/");
    const loginPage = new ContactListLoginPage(page);
    const contactListPage = await loginPage.login(credentials.email, credentials.password);

    await contactListPage.verifyContactListPage();
  });

  // Pattern 2: UI Action -> API Verification.
  test("TC031 UI action and API verification", async ({ contactAPI, page }) => {
    const { credentials, auth } = await registerAndLogin(contactAPI, "TC031");
    const contactPayload = createContactPayload("TC031");

    // UI step: log in and create a contact through the browser.
    await page.goto("/");
    const loginPage = new ContactListLoginPage(page);
    const contactListPage = await loginPage.login(credentials.email, credentials.password);
    const addContactPage = await contactListPage.openAddContactForm();
    await addContactPage.fillContactDetails(contactPayload);
    const contactListAfterAdd = await addContactPage.submit();

    // Wait for the UI's own create-contact round trip to finish before reading via API.
    await contactListAfterAdd.verifyContactListPage();
    await expect(contactListAfterAdd.contactRow(contactPayload.firstName)).toBeVisible();

    // API step: read the same contact from the shared backend.
    const apiResponse = await contactAPI.getContacts(auth.token);
    expect(apiResponse.status()).toBe(200);

    const contacts = await contactAPI.getResponseBody<Contact[]>(apiResponse);
    expect(contacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          firstName: contactPayload.firstName,
          lastName: contactPayload.lastName,
          email: contactPayload.email,
        }),
      ]),
    );
  });

  // Pattern 3: API Auth -> Skip UI Login.
  test("TC032 API auth skips UI login", async ({ contactAPI, page }) => {
    // API step: obtain the token without submitting the UI login form.
    const { auth } = await registerAndLogin(contactAPI, "TC032");

    // Transfer the API auth state to the browser and open the protected UI route.
    await page.goto("/");
    await page.evaluate((token) => localStorage.setItem("token", token), auth.token);
    await page.goto("/contactList");

    const contactListPage = new ContactListPage(page);
    await contactListPage.verifyContactListPage();
  });

  // Pattern 4: Parallel API + UI Checks.
  test("TC033 parallel API and UI checks", async ({ contactAPI, page }) => {
    const { auth } = await registerAndLogin(contactAPI, "TC033");

    // Run an API health/data check and a UI navigation check concurrently.
    const [apiResponse] = await Promise.all([
      contactAPI.getContacts(auth.token),
      page.goto("/"),
    ]);

    expect(apiResponse.status()).toBe(200);
    expect(await apiResponse.json()).toEqual(expect.any(Array));
    await expect(page).toHaveTitle(/Contact List App/);
  });
});

