import { test as base, type BrowserContext } from "@playwright/test";
import { BankDashboardPage } from "../src/ui/pages/bank-auth/BankDashboardPage";
import { BankLoginPage } from "../src/ui/pages/bank-auth/BankLoginPage";

type BankAuthFixtures = {
  bankContext: BrowserContext;
  bankLoginPage: BankLoginPage;
  bankDashboardPage: BankDashboardPage;
};

const parabankBaseURL =
  process.env.PARABANK_URL ??
  process.env.parabankUrl ??
  "https://parabank.parasoft.com/parabank/";

export const test = base.extend<BankAuthFixtures>({
  bankContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      baseURL: parabankBaseURL,
      storageState: { cookies: [], origins: [] },
    });

    try {
      await use(context);
    } finally {
      await context.close();
    }
  },

  bankLoginPage: async ({ bankContext }, use) => {
    const page = await bankContext.newPage();

    try {
      await use(new BankLoginPage(page));
    } finally {
      await page.close();
    }
  },

  bankDashboardPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      baseURL: parabankBaseURL,
      storageState: "playwright/.auth/bank-admin.json",
    });
    const page = await context.newPage();

    try {
      await use(new BankDashboardPage(page));
    } finally {
      await context.close();
    }
  },
});

export { expect } from "@playwright/test";