import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage'
export class InventoryPage extends BasePage {
 constructor(page: Page) {
    super(page);
  }   

}