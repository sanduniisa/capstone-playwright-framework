import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage'
export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly productCard:  Locator;
  readonly productLabel: Locator;
  readonly shoppingCartIcon: Locator;


 constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.productCard = page.locator('.inventory_item');
    this.productLabel = page.locator('.inventory_item_label');
    this.shoppingCartIcon = page.locator('[data-test="shopping-cart-link"]');

  }   
  async addProductToCart(productName: string): Promise<void> {
    const selectedItem = this.productCard.filter({has: this.productLabel.filter({hasText: productName})});
    const addToCartButton = selectedItem.getByRole('button', { name: 'Add to cart' });
    await addToCartButton.click();
  }
}