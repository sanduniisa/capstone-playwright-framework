import { test as base, expect } from "@playwright/test";
import { UsersAPI } from "../src/api/UsersAPI";
import { ContactListAPI } from "../src/api/ContactListAPI";

type APIFixtures = {
  /** A UsersAPI helper backed by the test's Playwright request context. */
  usersAPI: UsersAPI;
  /** API helper for the same-application Contact List scenarios. */
  contactAPI: ContactListAPI;
};

/**
 * API fixture layer, equivalent to the UI page-object fixtures.
 * Each test receives a ready-to-use domain API helper.
 */
export const test = base.extend<APIFixtures>({
  usersAPI: async ({ request }, use) => {
    await use(new UsersAPI(request));
  },
  contactAPI: async ({ request }, use) => {
    await use(new ContactListAPI(request));
  },
});

export { expect };
