import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../src/ui/pages/saucedemo/LoginPage";
import { loginScenarios } from "../../../test-data/ui/login-data";

test.describe("Login Page Tests", () => {
  for (const scenario of loginScenarios) {
    test(`${scenario.id} ${scenario.description}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      await loginPage.login(scenario.username, scenario.password);
      await expect(page).toHaveURL(/inventory\.html/);
    });
  }
});