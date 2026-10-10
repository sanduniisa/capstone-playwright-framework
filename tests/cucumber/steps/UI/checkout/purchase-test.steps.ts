// Implements checkout details, overview, and order-completion steps.
import { Then, When } from "@cucumber/cucumber";
import { PlaywrightWorld } from "../../../support/world";

When("I proceed to checkout", async function (this: PlaywrightWorld) {
  this.checkoutPage = await this.cartPage!.clickCheckout();
});

Then(
  "the checkout information page should be displayed",
  async function (this: PlaywrightWorld) {
    await this.checkoutPage!.verifyInformationPage();
  },
);

When(
  "I enter checkout details for {string} {string} with postal code {string}",
  async function (
    this: PlaywrightWorld,
    firstName: string,
    lastName: string,
    postalCode: string,
  ) {
    await this.checkoutPage!.fillCheckoutInformation({
      firstName,
      lastName,
      postalCode,
    });
  },
);

When("I continue to the checkout overview", async function (this: PlaywrightWorld) {
  await this.checkoutPage!.continueToOverview();
});

Then(
  "the checkout overview should contain {int} products",
  async function (this: PlaywrightWorld, expectedCount: number) {
    await this.checkoutPage!.verifyOverview(expectedCount);
  },
);

When("I finish the order", async function (this: PlaywrightWorld) {
  await this.checkoutPage!.finishOrder();
});

Then(
  "order completion details should be displayed",
  async function (this: PlaywrightWorld) {
    await this.checkoutPage!.verifyOrderCompletion();
  },
);
