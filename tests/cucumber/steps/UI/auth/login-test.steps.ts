// Implements SauceDemo login form, authentication, and validation steps.
import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { PlaywrightWorld } from "../../../support/world";

Given("I open the SauceDemo login page", async function (this: PlaywrightWorld) {
  await this.initializeLoginPageFixture();
});

When(
  "I log in with username {string} and password {string}",
  async function (this: PlaywrightWorld, username: string, password: string) {
    this.inventoryPage = await this.loginPage!.login(username, password);
  },
);

Then("I should reach the products page", async function (this: PlaywrightWorld) {
  await this.inventoryPage!.verifyPageTitle("Products");
  assert.match(this.page!.url(), /inventory\.html/);
});

Then(
  "I should see the login error message {string}",
  async function (this: PlaywrightWorld, expectedMessage: string) {
    const errorMessage = await this.loginPage!.getErrorMessage();
    assert.ok(errorMessage.includes(expectedMessage));
  },
);

Then("the login form should be visible", async function (this: PlaywrightWorld) {
  assert.equal(await this.loginPage!.isLoginFormVisible(), true);
});

When(
  "I enter username {string} and password {string}",
  async function (this: PlaywrightWorld, username: string, password: string) {
    await this.loginPage!.enterUsername(username);
    await this.loginPage!.enterPassword(password);
  },
);

When("I clear the login form", async function (this: PlaywrightWorld) {
  await this.loginPage!.clearForm();
});

When("I submit the login form", async function (this: PlaywrightWorld) {
  await this.loginPage!.clickLogin();
});

Then("the login error should be visible", async function (this: PlaywrightWorld) {
  assert.equal(await this.loginPage!.isErrorVisible(), true);
});

When("I dismiss the login error", async function (this: PlaywrightWorld) {
  await this.loginPage!.dismissError();
});

Then(
  "the login error should not be visible",
  async function (this: PlaywrightWorld) {
    assert.equal(await this.loginPage!.isErrorVisible(), false);
  },
);