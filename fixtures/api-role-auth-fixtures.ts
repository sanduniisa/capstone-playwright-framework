import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { test as base, expect } from "@playwright/test";
import { ContactListAPI } from "../src/api/ContactListAPI";

type ContactListAPIAuthFixtures = {
  contactListApiAuthToken: string;
  authenticatedContactAPI: ContactListAPI;
};

type ContactListAPIAuthState = {
  token: string;
};

const apiAuthStateFile = resolve(
  process.cwd(),
  "playwright/.auth/contact-list-api-user.json",
);

/** Loads the saved bearer token and applies it to Contact List API requests. */
export const test = base.extend<ContactListAPIAuthFixtures>({
  contactListApiAuthToken: async ({}, use) => {
    const authState = JSON.parse(
      await readFile(apiAuthStateFile, "utf8"),
    ) as ContactListAPIAuthState;

    if (!authState.token) {
      throw new Error(`No API bearer token found in ${apiAuthStateFile}`);
    }

    await use(authState.token);
  },

  authenticatedContactAPI: async ({ request, contactListApiAuthToken }, use) => {
    const contactAPI = new ContactListAPI(request);
    contactAPI.setAuthToken(contactListApiAuthToken);
    await use(contactAPI);
  },
});

export { expect };