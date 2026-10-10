// Implements saved-token Contact List API checks and token-based UI access.
import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import assert from "node:assert/strict";
import type { Contact } from "../../../../../../src/api/ContactListAPI";
import { createContactPayload } from "../../../../../../src/utils/contactListTestHelpers";
import { PlaywrightWorld } from "../../../support/world";

Given(
  "I use the saved Contact List API authentication",
  async function (this: PlaywrightWorld) {
    await this.loadSavedContactListAPIAuth();
  },
);

When(
  "I request the authenticated Contact List contacts",
  async function (this: PlaywrightWorld) {
    this.apiResponse = await this.contactAPI!.getContacts();
  },
);

When(
  "I create a unique Contact List contact for {string}",
  async function (this: PlaywrightWorld, testId: string) {
    this.contactPayload = createContactPayload(testId);
    this.apiResponse = await this.contactAPI!.createContact(this.contactPayload);
  },
);

Then(
  "Contact List API response status should be {int}",
  async function (this: PlaywrightWorld, expectedStatus: number) {
    assert.equal(this.apiResponse!.status(), expectedStatus);
  },
);

Then(
  "Contact List API response should be a JSON array",
  async function (this: PlaywrightWorld) {
    const contacts = await this.contactAPI!.getResponseBody<Contact[]>(this.apiResponse!);
    expect(contacts).toEqual(expect.any(Array));
    this.apiResponseBody = contacts;
  },
);

Then(
  "Contact List API response should include the created contact",
  async function (this: PlaywrightWorld) {
    const contacts = this.apiResponseBody
      ? (this.apiResponseBody as Contact[])
      : await this.contactAPI!.getResponseBody<Contact[]>(this.apiResponse!);
    expect(contacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          firstName: this.contactPayload!.firstName,
          lastName: this.contactPayload!.lastName,
          email: this.contactPayload!.email,
        }),
      ]),
    );
  },
);