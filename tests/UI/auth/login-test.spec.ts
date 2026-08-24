import {test, expect} from "@playwright/test";
import {LoginPage} from "../../../src/ui/pages/LoginPage";
import {InventoryPage} from "../../../src/ui/pages/InventoryPage";

test.describe('Login Page Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
});


test('verify login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
     //await inventoryPage.verifyPageTitle('Products');
     //verify redirected URL has inventory.htm
     await expect(page).toHaveURL(/inventory\.html/);
});
     
});