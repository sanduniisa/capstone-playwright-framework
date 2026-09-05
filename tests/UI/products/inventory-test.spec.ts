//import {test, expect} from '@playwright/test';
import { LoginPage } from '../../../src/ui/pages/LoginPage';
import {InventoryPage} from '../../../src/ui/pages/InventoryPage';
import { test, expect } from '../../../fixtures/ui-test-fixtures';

test.describe('Inventory Page Tests', () => {       
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        // inventoryPage = new InventoryPage(page);
        // await inventoryPage.navigate('/inventory.html');
        inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
    });                                                       

test('Add a product to the cart', async () => {
    const title = await inventoryPage.getTitle();
    expect(title).toBe('Swag Labs');
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
});

//with fixtures
test('Add products to the cart with fixtures', async ({ inventoryPageFixture }) => {
await inventoryPageFixture.addProductToCart('Sauce Labs Backpack');
await inventoryPageFixture.addProductToCart('Sauce Labs Bike Light');
await inventoryPageFixture.addProductToCart('Sauce Labs Bolt T-Shirt');

});


});