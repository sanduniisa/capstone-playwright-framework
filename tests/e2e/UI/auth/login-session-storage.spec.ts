import { expect, test } from "@playwright/test";
import { LoginPage } from "../../../../src/ui/pages/saucedemo/LoginPage";
import {
  captureSessionStorage,
  getSessionStorageValue,
  seedSessionStorage,
  setSessionStorageValue,
} from "../../../../src/utils/sessionStorage";

test.describe("Session storage auth patterns", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test("TC_SESSION_001 save and restore sessionStorage with addInitScript", async ({
    page,
    browser,
    baseURL,
  }) => {
    if (!baseURL) {
      throw new Error("A baseURL is required for the sessionStorage example.");
    }

    await setSessionStorageValue(page, "playwright-session-flag", "saved-session");
    const snapshot = await captureSessionStorage(page);

    expect(snapshot["playwright-session-flag"]).toBe("saved-session");

    const restoredContext = await browser.newContext({
      baseURL,
      storageState: { cookies: [], origins: [] },
    });

    await seedSessionStorage(restoredContext, snapshot);

    const restoredPage = await restoredContext.newPage();
    await restoredPage.goto("/");

    await expect
      .poll(async () => getSessionStorageValue(restoredPage, "playwright-session-flag"))
      .toBe("saved-session");

    await restoredContext.close();
  });
});