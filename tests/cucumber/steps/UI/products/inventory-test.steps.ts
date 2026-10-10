// Implements inventory setup, cart actions, and cart assertions.
import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import assert from "node:assert/strict";
import { PlaywrightWorld } from "../../../support/world";

Given(
  "I use the standard inventory fixture",
  async function (this: PlaywrightWorld) {
    await this.initializeInventoryPageFixture();
  },
);

Given(
  "I use the standard inventory fixture with three cart products",
  async function (this: PlaywrightWorld) {
    await this.initializeInventoryPageFixture(true);
  },
);

When(
  "I add product {string} to the cart",
  async function (this: PlaywrightWorld, productName: string) {
    await this.inventoryPage!.addProductToCart(productName);
  },
);

Then(
  "the cart badge should show {string}",
  async function (this: PlaywrightWorld, expectedCount: string) {
    assert.equal(await this.inventoryPage!.getProductCount(), Number(expectedCount));
  },
);

Then(
  "the inventory should show {int} remove buttons",
  async function (this: PlaywrightWorld, expectedCount: number) {
    assert.equal(await this.inventoryPage!.getRemoveButtonCount(), expectedCount);
  },
);

When("I open the shopping cart", async function (this: PlaywrightWorld) {
  this.cartPage = await this.inventoryPage!.openCart();
});

Then("the cart page should be displayed", async function (this: PlaywrightWorld) {
  await this.cartPage!.verifyCartPage();
});

Then(
  "the cart should contain {int} items",
  async function (this: PlaywrightWorld, expectedCount: number) {
    await expect(this.cartPage!.addedProductsCount).toHaveCount(expectedCount);
    assert.equal(await this.cartPage!.getCartItemCount(), expectedCount);
  },
);

Then(
  "the cart should include product {string}",
  async function (this: PlaywrightWorld, productName: string) {
    assert.ok((await this.cartPage!.getProductNames()).includes(productName));
  },
);

Then(
  "the continue shopping button should be enabled",
  async function (this: PlaywrightWorld) {
    await expect(this.cartPage!.continueShoppingButton).toBeVisible();
    await expect(this.cartPage!.continueShoppingButton).toBeEnabled();
  },
);

Then(
  "the checkout button should be enabled",
  async function (this: PlaywrightWorld) {
    await expect(this.cartPage!.checkoutButton).toBeVisible();
    await expect(this.cartPage!.checkoutButton).toBeEnabled();
  },
);

When("I continue shopping", async function (this: PlaywrightWorld) {
  this.inventoryPage = await this.cartPage!.clickContinueShopping();
});

Then("I should be on the inventory page", async function (this: PlaywrightWorld) {
  await expect(this.page!).toHaveURL(/inventory\.html/);
});

