import {
  test as base,
  type BrowserContext,
  type Page,
} from "@playwright/test";
import { getEnvironmentUrls } from "../config/environments";

interface AuthFixtures {
  /**
   * Provides pages backed by the saved admin and user storage states.
   * Each role gets an isolated context that is closed after the test. Request
   * one page for a single-role test, or both pages to exercise both sessions.
   */
  adminPage: Page;
  userPage: Page;
  adminContext: BrowserContext;
  userContext: BrowserContext;
}

const environmentUrls = getEnvironmentUrls();
const baseURL = environmentUrls.sauceDemoUrl;

export const test = base.extend<AuthFixtures>({
  adminContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      storageState: "playwright/.auth/admin.json",
    });

    try {
      await use(context);
    } finally {
      await context.close();
    }
  },

  adminPage: async ({ adminContext }, use) => {
    await use(await adminContext.newPage());
  },

  userContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      baseURL,
      storageState: "playwright/.auth/user.json",
    });

    try {
      await use(context);
    } finally {
      await context.close();
    }
  },

  userPage: async ({ userContext }, use) => {
    await use(await userContext.newPage());
  },
});

export { expect } from "@playwright/test";