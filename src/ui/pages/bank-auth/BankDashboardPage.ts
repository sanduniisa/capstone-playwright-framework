import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class BankDashboardPage extends BasePage {
  readonly accountOverviewLink: Locator;

  constructor(page: Page) {
    super(page);
    this.accountOverviewLink = page.getByRole("link", { name: "Accounts Overview" });
  }

  async navigate(path = "overview.htm"): Promise<void> {
    await super.navigate(path);
  }

  async verifyDashboardLoaded(): Promise<void> {
    await expect(this.accountOverviewLink).toBeVisible({ timeout: 10_000 });
  }
}