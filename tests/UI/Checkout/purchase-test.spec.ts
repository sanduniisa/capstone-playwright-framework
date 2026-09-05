import { test, expect } from "../../../fixtures/ui-test-fixtures";

test.describe("Purchase checkout tests", () => {
    
  test("TC_007 complete checkout with customer information", async ({
    inventoryPageWithProductsFixture,
  }) => {
    const inventoryPage = inventoryPageWithProductsFixture;

    const cartPage = await inventoryPage.openCart();
    await cartPage.verifyCartPage();
    console.log("PASS: TC_007 opened the Your Cart page");

    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(3);
    console.log(`PASS: Cart contains ${cartItemCount} products`);

    const checkoutPage = await cartPage.clickCheckout();
    await checkoutPage.verifyInformationPage();
    console.log("PASS: Checkout information page opened");

    await checkoutPage.fillCheckoutInformation({
      firstName: "Test",
      lastName: "Customer",
      postalCode: "10001",
    });
    console.log("PASS: Checkout information was filled");

    await checkoutPage.continueToOverview();
    await checkoutPage.verifyOverview(3);
    console.log("PASS: Checkout overview contains 3 products");
    console.log("PASS: Order summary contains subtotal, tax, and total");

    await checkoutPage.finishOrder();
    await checkoutPage.verifyOrderCompletion();
    console.log("PASS: Checkout completion title is displayed");
    console.log("PASS: Thank you for your order! is displayed");
    console.log("PASS: Back Home button is visible and enabled");
    console.log("PASS: Generate PDF Order button is visible and enabled");
  });
});
