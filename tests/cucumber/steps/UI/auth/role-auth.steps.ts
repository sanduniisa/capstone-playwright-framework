// Implements shared saved-role and multi-session authentication steps.
import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import assert from "node:assert/strict";
import { PlaywrightWorld } from "../../../support/world";

Given(
  "I use the saved {string} session",
  async function (this: PlaywrightWorld, role: string) {
    if (role !== "admin" && role !== "user" && role !== "performance_glitch_user") {
      throw new Error(`Unknown saved session role: ${role}`);
    }
    await this.initializeSavedRoleSession(role);
  },
);

Then(
  "the inventory should contain {int} products",
  async function (this: PlaywrightWorld, expectedCount: number) {
    await expect(this.inventoryPage!.productCard).toHaveCount(expectedCount);
  },
);

When(
  "I create a second session from the saved {string} role",
  async function (this: PlaywrightWorld, role: string) {
    if (role !== "admin" && role !== "user" && role !== "performance_glitch_user") {
      throw new Error(`Unknown saved session role: ${role}`);
    }
    await this.initializeSavedRoleSession(role, true);
  },
);

Then(
  "both sessions should display the products page",
  async function (this: PlaywrightWorld) {
    await this.inventoryPage!.verifyPageTitle("Products");
    await this.secondaryInventoryPage!.verifyPageTitle("Products");
  },
);

Then(
  "both sessions should show {int} products",
  async function (this: PlaywrightWorld, expectedCount: number) {
    assert.equal(await this.inventoryPage!.getVisibleProductCount(), expectedCount);
    assert.equal(await this.secondaryInventoryPage!.getVisibleProductCount(), expectedCount);
  },
);

When(
  "I add product {string} to the primary session cart",
  async function (this: PlaywrightWorld, productName: string) {
    await this.inventoryPage!.addProductToCart(productName);
  },
);

When(
  "I add product {string} to the secondary session cart",
  async function (this: PlaywrightWorld, productName: string) {
    await this.secondaryInventoryPage!.addProductToCart(productName);
  },
);

Then(
  "the primary session cart badge should show {string}",
  async function (this: PlaywrightWorld, expectedCount: string) {
    assert.equal(await this.inventoryPage!.getProductCount(), Number(expectedCount));
  },
);

Then(
  "the secondary session cart badge should be empty",
  async function (this: PlaywrightWorld) {
    await expect(this.secondaryInventoryPage!.productCountIndicator).toHaveCount(0);
  },
);

Then(
  "the secondary session cart badge should show {string}",
  async function (this: PlaywrightWorld, expectedCount: string) {
    assert.equal(
      await this.secondaryInventoryPage!.getProductCount(),
      Number(expectedCount),
    );
  },
);

When(
  "I open the shopping cart in both sessions",
  async function (this: PlaywrightWorld) {
    this.cartPage = await this.inventoryPage!.openCart();
    this.secondaryCartPage = await this.secondaryInventoryPage!.openCart();
  },
);

Then(
  "the primary session cart should include product {string}",
  async function (this: PlaywrightWorld, productName: string) {
    assert.ok((await this.cartPage!.getProductNames()).includes(productName));
  },
);

Then(
  "the secondary session cart should include product {string}",
  async function (this: PlaywrightWorld, productName: string) {
    assert.ok((await this.secondaryCartPage!.getProductNames()).includes(productName));
  },
);

When(
  "I sort the primary session inventory by {string}",
  async function (this: PlaywrightWorld, sortValue: string) {
    await this.inventoryPage!.sortProducts(sortValue);
  },
);

When(
  "I sort the secondary session inventory by {string}",
  async function (this: PlaywrightWorld, sortValue: string) {
    await this.secondaryInventoryPage!.sortProducts(sortValue);
  },
);

Then(
  "the first visible product names in each session should differ",
  async function (this: PlaywrightWorld) {
    assert.notEqual(
      await this.inventoryPage!.getFirstVisibleProductName(),
      await this.secondaryInventoryPage!.getFirstVisibleProductName(),
    );
  },
);