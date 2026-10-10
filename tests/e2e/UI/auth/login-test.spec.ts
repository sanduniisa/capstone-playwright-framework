import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../../src/ui/pages/saucedemo/LoginPage";
import {
  loginErrorScenarios,
  loginScenarios,
} from "../../../../test-data/ui/login-data";

test.describe("Login Page Tests", () => {
  // Start each scenario from a fresh, unauthenticated login page.
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  // Successful login scenarios are kept in shared UI test data.
  for (const scenario of loginScenarios) {
    test(`${scenario.id} ${scenario.description}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = await loginPage.login(
        scenario.username,
        scenario.password,
      );
      await inventoryPage.verifyPageTitle("Products");
      await expect(page).toHaveURL(/inventory\.html/);
    });
  }

  // Validate that the login form is available before submitting credentials.
  test("TC_007 login form is visible on initial load", async ({ page }) => {
    const loginPage = new LoginPage(page);
    expect(await loginPage.isLoginFormVisible()).toBe(true);
  });

  // Invalid and incomplete credentials should be rejected with useful messages.
  for (const scenario of loginErrorScenarios) {
    test(`${scenario.id} ${scenario.description}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.login(scenario.username, scenario.password);

      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain(scenario.expectedMessage);
    });
  }

  // Clearing and dismissing are separate login-form interactions.
  test("TC_008 clearing the form removes entered credentials", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.enterUsername("test_user");
    await loginPage.enterPassword("test_password");

    await loginPage.clearForm();
    await loginPage.clickLogin();

    expect(await loginPage.getErrorMessage()).toContain("Username is required");
  });

  test("TC_009 login error can be dismissed", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("invalid_user", "wrong_password");
    expect(await loginPage.isErrorVisible()).toBe(true);

    await loginPage.dismissError();

    expect(await loginPage.isErrorVisible()).toBe(false);
  });
});