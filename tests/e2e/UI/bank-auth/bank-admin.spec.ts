import { BankDashboardPage } from "../../../../src/ui/pages/bank-auth/BankDashboardPage";
import { test } from "../../../../fixtures/bank-auth-fixtures";

test.describe("Parabank admin authenticated flows", () => {
  test("TC_BANK_001 saved bank admin auth opens the dashboard", async ({
    bankDashboardPage,
  }) => {
    await bankDashboardPage.navigate();
    await bankDashboardPage.verifyDashboardLoaded();
  });

  test("TC_BANK_002 configured bank admin credentials can log in", async ({
    bankLoginPage,
  }) => {
    const username = process.env.PARABANK_ADMIN_USERNAME;
    const password = process.env.PARABANK_ADMIN_PASSWORD;

    if (!username || !password) {
      throw new Error(
        "PARABANK_ADMIN_USERNAME and PARABANK_ADMIN_PASSWORD must be set to run Parabank login tests.",
      );
    }

    await bankLoginPage.navigate();
    await bankLoginPage.login(username, password);

    const bankDashboardPage = new BankDashboardPage(bankLoginPage.page);
    await bankDashboardPage.waitForUrl(/overview\.htm/);
    await bankDashboardPage.verifyDashboardLoaded();
  });
});