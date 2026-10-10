import { InventoryPage } from "../../../../src/ui/pages/saucedemo/InventoryPage";
import { expect, test } from "../../../../fixtures/ui-role-auth-fixtures";

test.describe("Admin and user sessions in separate contexts", () => {
  test("TC_AUTH_MULTI_001 admin and user sessions keep separate carts", async ({
    adminPage,
    userPage,
  }) => {
    await adminPage.goto("/inventory.html");
    await userPage.goto("/inventory.html");

    await expect(adminPage.locator(".title")).toHaveText("Products", {
      timeout: 30000,
    });
    await expect(userPage.locator(".title")).toHaveText("Products", {
      timeout: 30000,
    });

    const adminInventory = new InventoryPage(adminPage);
    await adminInventory.addProductToCart("Sauce Labs Backpack");

    await expect(adminInventory.productCountIndicator).toHaveText("1");
    await expect(userPage.locator(".shopping_cart_badge")).toHaveCount(0);
  });

  test("TC_AUTH_MULTI_002 admin and user both see the same products", async ({
    adminPage,
    userPage,
  }) => {
    await adminPage.goto("/inventory.html");
    await userPage.goto("/inventory.html");

    const adminInventory = new InventoryPage(adminPage);
    const userInventory = new InventoryPage(userPage);

    await adminInventory.verifyInventoryPage();
    await userInventory.verifyInventoryPage();

    expect(await adminInventory.getVisibleProductCount()).toBe(6);
    expect(await userInventory.getVisibleProductCount()).toBe(6);
    expect(await adminInventory.getVisibleProductCount()).toBe(
      await userInventory.getVisibleProductCount(),
    );
  });

  test("TC_AUTH_MULTI_003 admin and user can add different items simultaneously", async ({
    adminPage,
    userPage,
  }) => {
    await adminPage.goto("/inventory.html");
    await userPage.goto("/inventory.html");

    const adminInventory = new InventoryPage(adminPage);
    const userInventory = new InventoryPage(userPage);

    await adminInventory.addProductToCart("Sauce Labs Backpack");
    await userInventory.addProductToCart("Sauce Labs Bike Light");

    await expect(adminInventory.productCountIndicator).toHaveText("1");
    await expect(userInventory.productCountIndicator).toHaveText("1");

    const adminCart = await adminInventory.openCart();
    const userCart = await userInventory.openCart();

    await expect(adminCart.productNames).toHaveText(["Sauce Labs Backpack"]);
    await expect(userCart.productNames).toHaveText(["Sauce Labs Bike Light"]);
  });

  test("TC_AUTH_MULTI_004 sorting in one context does not affect the other", async ({
    adminPage,
    userPage,
  }) => {
    await adminPage.goto("/inventory.html");
    await userPage.goto("/inventory.html");

    const adminInventory = new InventoryPage(adminPage);
    const userInventory = new InventoryPage(userPage);

    await adminInventory.sortProducts("hilo");
    await userInventory.sortProducts("za");

    expect(await adminInventory.getFirstVisibleProductName()).not.toBe(
      await userInventory.getFirstVisibleProductName(),
    );
  });
});