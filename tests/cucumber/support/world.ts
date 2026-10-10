import { World, setWorldConstructor } from "@cucumber/cucumber";
import {
  chromium,
  request,
  type APIRequestContext,
  type APIResponse,
  type Browser,
  type BrowserContext,
  type Page,
} from "@playwright/test";
import { readFile } from "node:fs/promises";
import process from "node:process";
import { ContactListAPI, type ContactPayload, type ContactUserCredentials, type ContactUserResponse } from "../../../src/api/ContactListAPI";
import { UsersAPI } from "../../../src/api/UsersAPI";
import { createMockHelper, type MockHelper } from "../../../src/utils/mockHelper";
import { AddContactPage } from "../../../src/ui/pages/herokuapp/AddContactPage";
import { ContactListLoginPage } from "../../../src/ui/pages/herokuapp/ContactListLoginPage";
import { ContactListPage } from "../../../src/ui/pages/herokuapp/ContactListPage";
import { CartPage } from "../../../src/ui/pages/saucedemo/CartPage";
import { CheckoutPage } from "../../../src/ui/pages/saucedemo/CheckoutPage";
import { LoginPage } from "../../../src/ui/pages/saucedemo/LoginPage";
import { InventoryPage } from "../../../src/ui/pages/saucedemo/InventoryPage";
import {
  createInventoryPageFixture,
  createInventoryPageWithProductsFixture,
  createLoginPageFixture,
} from "../../../src/ui/uiFixtureSetup";

/** Holds per-scenario Playwright resources, API clients, page objects, and captured test state. */
export class PlaywrightWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  loginPage?: LoginPage;
  inventoryPage?: InventoryPage;
  cartPage?: CartPage;
  secondaryCartPage?: CartPage;
  checkoutPage?: CheckoutPage;
  secondaryContext?: BrowserContext;
  secondaryPage?: Page;
  secondaryInventoryPage?: InventoryPage;
  apiContext?: APIRequestContext;
  usersAPI?: UsersAPI;
  contactAPI?: ContactListAPI;
  apiResponse?: APIResponse;
  apiResponseBody?: unknown;
  contactListLoginPage?: ContactListLoginPage;
  contactListPage?: ContactListPage;
  addContactPage?: AddContactPage;
  contactCredentials?: ContactUserCredentials;
  contactAuth?: ContactUserResponse;
  contactPayload?: ContactPayload;
  contactToken?: string;
  mockHelper?: MockHelper;
  browserConsoleLogs: Array<{ type: string; text: string }> = [];
  capturedRequests: string[] = [];
  capturedResponses: Array<{ url: string; status: number }> = [];
  fruitsResponse?: import("@playwright/test").Response;
  outgoingFruitRequestHeaders?: Record<string, string>;
  blockedRequestCount = 0;
  failedRequestCount = 0;
  recordedHarEntryCount = 0;

  readonly baseURL =
    process.env.SAUCEDEMO_URL ??
    process.env.sauceDemoUrl ??
    "https://www.saucedemo.com/";
  readonly contactListBaseURL =
    process.env.CONTACT_LIST_URL ??
    "https://thinking-tester-contact-list.herokuapp.com";
  readonly reqresBaseURL =
    process.env.REQRES_API_URL ??
    process.env.reqresApiUrl ??
    "https://reqres.in/api/";

  async startBrowser(baseURL = this.baseURL): Promise<void> {
    this.browser = await chromium.launch({
      headless: (process.env.HEADED ?? "").toLowerCase() !== "true",
    });
    this.context = await this.browser.newContext({ baseURL });
    this.page = await this.context.newPage();
    this.loginPage = new LoginPage(this.page);
  }

  async closeBrowser(): Promise<void> {
    await this.secondaryContext?.close();
    await this.context?.close();
    await this.apiContext?.dispose();
    await this.browser?.close();
  }

  async startReqresAPI(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: this.reqresBaseURL,
      extraHTTPHeaders: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key":
          process.env.REQRES_API_KEY ??
          "free_user_3E75Ai3rComzXI0NWpSXIL6LG7b",
      },
    });
    this.usersAPI = new UsersAPI(this.apiContext);
  }

  async startContactListAPI(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: this.contactListBaseURL,
    });
    this.contactAPI = new ContactListAPI(this.apiContext);
  }

  async startMockingBrowser(): Promise<void> {
    const mockingBaseURL =
      process.env.MOCKING_URL ??
      "https://demo.playwright.dev/api-mocking/";
    await this.startBrowser(mockingBaseURL);
    this.mockHelper = createMockHelper(this.page!);
    this.page!.on("console", (message) => {
      this.browserConsoleLogs.push({
        type: message.type(),
        text: message.text(),
      });
    });
    this.page!.on("pageerror", (error) => {
      this.browserConsoleLogs.push({ type: "error", text: error.message });
    });
    this.page!.on("request", (request) => {
      this.capturedRequests.push(`${request.method()} ${request.url()}`);
      if (request.url().includes("/api/v1/fruits")) {
        this.outgoingFruitRequestHeaders = request.headers();
      }
    });
    this.page!.on("response", (response) => {
      this.capturedResponses.push({ url: response.url(), status: response.status() });
      if (response.url().includes("/api/v1/fruits")) {
        this.fruitsResponse = response;
      }
    });
    this.page!.on("requestfailed", () => {
      this.failedRequestCount++;
    });
  }

  async loadSavedContactListAPIAuth(): Promise<void> {
    const savedState = JSON.parse(
      await readFile("playwright/.auth/contact-list-api-user.json", "utf8"),
    ) as { token: string };
    this.contactToken = savedState.token;
    this.contactAPI!.setAuthToken(savedState.token);
  }

  async initializeLoginPageFixture(): Promise<LoginPage> {
    this.loginPage = await createLoginPageFixture(this.page!);
    return this.loginPage;
  }

  async initializeInventoryPageFixture(withProducts = false): Promise<InventoryPage> {
    this.inventoryPage = withProducts
      ? await createInventoryPageWithProductsFixture(this.page!)
      : await createInventoryPageFixture(this.page!);
    return this.inventoryPage;
  }

  async initializeSavedRoleSession(
    role: "admin" | "user" | "performance_glitch_user",
    secondary = false,
  ): Promise<void> {
    const storageState =
      role === "admin"
        ? "playwright/.auth/admin.json"
        : "playwright/.auth/user.json";
    const roleContext = await this.browser!.newContext({
      baseURL: this.baseURL,
      storageState,
    });
    const rolePage = await roleContext.newPage();
    if (role === "performance_glitch_user") {
      rolePage.setDefaultNavigationTimeout(60_000);
      rolePage.setDefaultTimeout(60_000);
    }
    await rolePage.goto("/inventory.html");
    const roleInventoryPage = new InventoryPage(rolePage);

    if (secondary) {
      this.secondaryContext = roleContext;
      this.secondaryPage = rolePage;
      this.secondaryInventoryPage = roleInventoryPage;
      return;
    }

    await this.context?.close();
    this.context = roleContext;
    this.page = rolePage;
    this.loginPage = new LoginPage(rolePage);
    this.inventoryPage = roleInventoryPage;
  }
}

setWorldConstructor(PlaywrightWorld);