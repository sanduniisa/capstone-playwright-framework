import {test, expect} from "@playwright/test";
import {LoginPage} from "../../../src/ui/pages/LoginPage";
import {InventoryPage} from "../../../src/ui/pages/InventoryPage";

test.describe('TC_001 Login Page Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
});


test('TC_002 Verify login successfully with valid credentials', async ({ page }) => {
    // const loginPage = new LoginPage(page);
    // await loginPage.navigate(); //line 16 17 no need its already in before each
    const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
     //await inventoryPage.verifyPageTitle('Products');
     //verify redirected URL has inventory.html
     //Regex to match the URL pattern for inventory.html
     await expect(page).toHaveURL(/inventory\.html/);
});
     
});