import { expect, test } from "../../../../fixtures/ui-role-auth-fixtures";
import { InventoryPage } from "../../../../src/ui/pages/saucedemo/InventoryPage";

test.describe("Admin and performance glitch user run in parallel", () => {
  test.describe.configure({ mode: "parallel" });

  test("TC_AUTH_PARALLEL_001 admin session loads the inventory", async ({
    adminPage,
  }) => {
    await adminPage.goto("/inventory.html");

    const inventoryPage = new InventoryPage(adminPage);
    await inventoryPage.verifyInventoryPage();
    await expect(inventoryPage.productCard).toHaveCount(6);
  });

  test("TC_AUTH_PARALLEL_002 performance_glitch_user loads the inventory", async ({
    userPage,
  }) => {
    test.setTimeout(90_000);
    userPage.setDefaultNavigationTimeout(60_000);
    userPage.setDefaultTimeout(60_000);

    await userPage.goto("/inventory.html");

    const inventoryPage = new InventoryPage(userPage);
    await inventoryPage.verifyInventoryPage();
    await expect(inventoryPage.productCard).toHaveCount(6, { timeout: 60_000 });
  });
});
