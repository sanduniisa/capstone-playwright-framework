import { test as setup } from "@playwright/test";
import { BankDashboardPage } from "../../../../src/ui/pages/bank-auth/BankDashboardPage";
import { BankLoginPage } from "../../../../src/ui/pages/bank-auth/BankLoginPage";

const bankAuthFile = "playwright/.auth/bank-admin.json";

setup("authenticate as bank admin user", async ({ page }) => {
  const username = process.env.PARABANK_ADMIN_USERNAME;
  const password = process.env.PARABANK_ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "PARABANK_ADMIN_USERNAME and PARABANK_ADMIN_PASSWORD must be set to generate bank-admin auth state.",
    );
  }

  const bankLoginPage = new BankLoginPage(page);
  await bankLoginPage.navigate();
  await bankLoginPage.login(username, password);

  const bankDashboardPage = new BankDashboardPage(page);
  await bankDashboardPage.waitForUrl(/overview\.htm/);
  await bankDashboardPage.verifyDashboardLoaded();

  await page.context().storageState({ path: bankAuthFile });
  console.log("✅ Bank admin authentication state saved to:", bankAuthFile);
});