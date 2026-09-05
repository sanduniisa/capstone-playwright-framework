import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CartPage } from "./CartPage";
export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly productCard: Locator;
  readonly productCountIndicator: Locator;
  readonly productLabel: Locator;
  readonly shoppingCartIcon: Locator;
  readonly removeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator(".title");
    this.productCard = page.locator(".inventory_item");
    this.productLabel = page.locator(".inventory_item_label");
    this.shoppingCartIcon = page.locator('[data-test="shopping-cart-link"]');
    this.productCountIndicator = page.locator(".shopping_cart_badge");
    this.removeButton = page.getByRole("button", { name: "Remove" });
  }

  //to verify the page title
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    await this.pageTitle.waitFor({ state: "visible" });
    await expect(this.pageTitle).toHaveText(expectedTitle);
  }

  async verifyInventoryPage(): Promise<void> {
    await this.verifyTitle("Swag Labs");
    await this.verifyPageTitle("Products");
  }

  //to add a product to the cart
  async addProductToCart(productName: string): Promise<void> {
    const selectedItem = this.productCard.filter({
      has: this.productLabel.filter({ hasText: productName }),
    });
    const addToCartButton = selectedItem.getByRole("button", {
      name: "Add to cart",
    });
    await addToCartButton.click();
  }
  //to assert the number ofproducts in the cart
  async getProductCount(): Promise<number> {
    await this.productCountIndicator.waitFor({ state: "visible" });
    const countText = await this.productCountIndicator.textContent();
    return countText ? Number(countText) : 0;
  }
  //to assert the remove button count
  async getRemoveButtonCount(): Promise<number> {
    return await this.removeButton.count();
  }

  //to open the shopping cart
  async openCart(): Promise<CartPage> {
    await this.shoppingCartIcon.click();
    await this.page.waitForURL(/cart\.html/);
    return new CartPage(this.page);
  }
}
