// Implements Contact List registration, UI, and API integration steps.
import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import assert from "node:assert/strict";
import type { Contact } from "../../../../../src/api/ContactListAPI";
import {
  createContactPayload,
  registerAndLogin,
} from "../../../../../src/utils/contactListTestHelpers";
import { ContactListLoginPage } from "../../../../../src/ui/pages/herokuapp/ContactListLoginPage";
import { ContactListPage } from "../../../../../src/ui/pages/herokuapp/ContactListPage";
import { PlaywrightWorld } from "../../../support/world";

Given(
  "I register and log in a Contact List user for {string}",
  async function (this: PlaywrightWorld, testId: string) {
    const result = await registerAndLogin(this.contactAPI!, testId);
    this.contactCredentials = result.credentials;
    this.contactAuth = result.auth;
  },
);

When(
  "I sign in to the Contact List UI with that user",
  async function (this: PlaywrightWorld) {
    await this.page!.goto("/");
    this.contactListLoginPage = new ContactListLoginPage(this.page!);
    this.contactListPage = await this.contactListLoginPage.login(
      this.contactCredentials!.email,
      this.contactCredentials!.password,
    );
  },
);

When(
  "I create a Contact List contact for {string}",
  async function (this: PlaywrightWorld, testId: string) {
    this.contactPayload = createContactPayload(testId);
    this.addContactPage = await this.contactListPage!.openAddContactForm();
    await this.addContactPage.fillContactDetails(this.contactPayload);
    this.contactListPage = await this.addContactPage.submit();
    await expect(
      this.contactListPage.contactRow(this.contactPayload.firstName),
    ).toBeVisible();
  },
);

When(
  "I fetch contacts for that user through the API",
  async function (this: PlaywrightWorld) {
    this.apiResponse = await this.contactAPI!.getContacts(this.contactAuth!.token);
    this.apiResponseBody = await this.contactAPI!.getResponseBody<Contact[]>(
      this.apiResponse,
    );
  },
);

When(
  "I open the Contact List UI using the API token",
  async function (this: PlaywrightWorld) {
    await this.page!.goto("/");
    const token = this.contactAuth?.token ?? this.contactToken!;
    await this.page!.evaluate((savedToken) => localStorage.setItem("token", savedToken), token);
    await this.page!.goto("/contactList");
    this.contactListPage = new ContactListPage(this.page!);
  },
);

When(
  "I check the Contact List API and UI in parallel",
  async function (this: PlaywrightWorld) {
    const [apiResponse] = await Promise.all([
      this.contactAPI!.getContacts(this.contactAuth!.token),
      this.page!.goto("/"),
    ]);
    this.apiResponse = apiResponse;
    this.apiResponseBody = await this.contactAPI!.getResponseBody<Contact[]>(apiResponse);
  },
);

Then(
  "the Contact List page should be displayed",
  async function (this: PlaywrightWorld) {
    await this.contactListPage!.verifyContactListPage();
  },
);

Then(
  "the Contact List API response status should be {int}",
  async function (this: PlaywrightWorld, expectedStatus: number) {
    assert.equal(this.apiResponse!.status(), expectedStatus);
  },
);

Then(
  "the Contact List UI title should be visible",
  async function (this: PlaywrightWorld) {
    await expect(this.page!).toHaveTitle(/Contact List App/);
    expect(this.apiResponseBody).toEqual(expect.any(Array));
  },
);