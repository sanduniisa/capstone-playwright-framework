// Implements shared steps for API mocking, network events, HAR, resource blocking, and URL matching.
import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PlaywrightWorld } from "../../support/world";

const FRUITS_PATTERN = "*/**/api/v1/fruits";

function latestFruitsResponse(world: PlaywrightWorld) {
  return world.fruitsResponse;
}

Given(
  "I mock fruits with these records",
  async function (this: PlaywrightWorld, table) {
    const fruits = table.hashes().map((row: Record<string, string>) => ({
      name: row.name,
      id: Number(row.id),
    }));
    await this.mockHelper!.mockRoute({ url: FRUITS_PATTERN, json: fruits });
  },
);

Given(
  "I mock fruits using the shared {string} file",
  async function (this: PlaywrightWorld, fileName: string) {
    const fruits = this.mockHelper!.loadMockData(fileName);
    await this.mockHelper!.mockRoute({ url: FRUITS_PATTERN, json: fruits });
  },
);

Given(
  "I mock the fruits API with status {int} and error {string}",
  async function (this: PlaywrightWorld, status: number, error: string) {
    await this.mockHelper!.mockRoute({
      url: FRUITS_PATTERN,
      status,
      json: { error },
    });
  },
);

Given("I mock the fruits API with an empty list", async function (this: PlaywrightWorld) {
  await this.mockHelper!.mockRoute({ url: FRUITS_PATTERN, json: [] });
});

Given(
  "I mock fruits with a {int} second delay and record {string}",
  async function (this: PlaywrightWorld, delaySeconds: number, fruitName: string) {
    await this.page!.route(FRUITS_PATTERN, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
      await route.fulfill({ json: [{ name: fruitName, id: 99 }] });
    });
  },
);

Given(
  "I mock fruits with {string} and response header {string} value {string}",
  async function (
    this: PlaywrightWorld,
    fruitName: string,
    headerName: string,
    headerValue: string,
  ) {
    await this.mockHelper!.mockRoute({
      url: FRUITS_PATTERN,
      json: [{ name: fruitName, id: 50 }],
      headers: { "content-type": "application/json", [headerName]: headerValue },
    });
  },
);

When("I open the mocking demo", async function (this: PlaywrightWorld) {
  await this.page!.goto("./");
});

Then(
  "the page should display fruit {string}",
  async function (this: PlaywrightWorld, fruitName: string) {
    await expect(this.page!.getByText(fruitName)).toBeVisible();
  },
);

Then(
  "the page should not display fruit {string}",
  async function (this: PlaywrightWorld, fruitName: string) {
    await expect(this.page!.getByText(fruitName)).toHaveCount(0);
  },
);

Then(
  "the page should display fruit {string} within {int} seconds",
  async function (this: PlaywrightWorld, fruitName: string, timeoutSeconds: number) {
    await expect(this.page!.getByText(fruitName)).toBeVisible({
      timeout: timeoutSeconds * 1000,
    });
  },
);

Then(
  "the fruits API response status should be {int}",
  async function (this: PlaywrightWorld, expectedStatus: number) {
    await expect
      .poll(() => latestFruitsResponse(this)?.status())
      .toBe(expectedStatus);
  },
);

Then(
  "the fruits API response header {string} should be {string}",
  async function (this: PlaywrightWorld, headerName: string, expectedValue: string) {
    await expect
      .poll(() => latestFruitsResponse(this)?.headers()[headerName])
      .toBe(expectedValue);
  },
);

Given(
  "I append {string} to the real fruits response",
  async function (this: PlaywrightWorld, fruitName: string) {
    await this.page!.route(FRUITS_PATTERN, async (route) => {
      const response = await route.fetch();
      const fruits = await response.json();
      fruits.push({ name: fruitName, id: 999 });
      await route.fulfill({ response, json: fruits });
    });
  },
);

Given(
  "I replace the first real fruit with {string}",
  async function (this: PlaywrightWorld, fruitName: string) {
    await this.page!.route(FRUITS_PATTERN, async (route) => {
      const response = await route.fetch();
      const fruits = await response.json();
      if (fruits.length > 0) fruits[0].name = fruitName;
      await route.fulfill({ response, json: fruits });
    });
  },
);

Given(
  "I limit the real fruits response to {int} items",
  async function (this: PlaywrightWorld, count: number) {
    await this.page!.route(FRUITS_PATTERN, async (route) => {
      const response = await route.fetch();
      const fruits = await response.json();
      await route.fulfill({ response, json: fruits.slice(0, count) });
    });
  },
);

Given(
  "I add response header {string} value {string} to the real fruits response",
  async function (this: PlaywrightWorld, headerName: string, headerValue: string) {
    await this.page!.route(FRUITS_PATTERN, async (route) => {
      const response = await route.fetch();
      await route.fulfill({
        response,
        headers: { ...response.headers(), [headerName]: headerValue },
      });
    });
  },
);

Given(
  "I add request header {string} value {string} to the fruits request",
  async function (this: PlaywrightWorld, headerName: string, headerValue: string) {
    await this.page!.route(FRUITS_PATTERN, async (route) => {
      const headers = {
        ...route.request().headers(),
        [headerName]: headerValue,
      };
      this.outgoingFruitRequestHeaders = headers;
      await route.continue({ headers });
    });
  },
);

Then(
  "the outgoing fruits request header {string} should be {string}",
  async function (this: PlaywrightWorld, headerName: string, expectedValue: string) {
    await expect
      .poll(() => this.outgoingFruitRequestHeaders?.[headerName.toLowerCase()])
      .toBe(expectedValue);
  },
);

Given(
  "I remove request header {string} before forwarding",
  async function (this: PlaywrightWorld, headerName: string) {
    await this.page!.route("**/*", async (route) => {
      const headers = { ...route.request().headers() };
      delete headers[headerName.toLowerCase()];
      this.outgoingFruitRequestHeaders = headers;
      await route.continue({ headers });
    });
  },
);

Then(
  "the forwarded request headers should not contain {string}",
  async function (this: PlaywrightWorld, headerName: string) {
    expect(this.outgoingFruitRequestHeaders).toBeDefined();
    expect(this.outgoingFruitRequestHeaders).not.toHaveProperty(headerName.toLowerCase());
  },
);

Then(
  "the fruits API response should contain {int} items",
  async function (this: PlaywrightWorld, expectedCount: number) {
    await expect
      .poll(async () => (await latestFruitsResponse(this)?.json())?.length)
      .toBe(expectedCount);
  },
);

Given(
  "I mock fruits with matching strategy {string} and fruit {string}",
  async function (this: PlaywrightWorld, strategy: string, fruitName: string) {
    const handler = async (route: import("@playwright/test").Route) => {
      if (strategy === "a GET method check" && route.request().method() !== "GET") {
        await route.continue();
        return;
      }
      await route.fulfill({ json: [{ name: fruitName, id: 1 }] });
    };

    if (strategy === "a glob pattern") {
      await this.page!.route(FRUITS_PATTERN, handler);
    } else if (strategy === "a regular expression") {
      await this.page!.route(/\/api\/v1\/fruits$/, handler);
    } else {
      await this.page!.route(
        (url) => url.pathname.endsWith("/api/v1/fruits"),
        handler,
      );
    }
  },
);

Given(
  "I block image requests by extension",
  async function (this: PlaywrightWorld) {
    await this.page!.route("**/*.{png,jpg,jpeg,gif,svg,webp}", async (route) => {
      this.blockedRequestCount++;
      await route.abort();
    });
  },
);

Given(
  "I block image and font resources",
  async function (this: PlaywrightWorld) {
    await this.page!.route("**/*", async (route) => {
      const type = route.request().resourceType();
      if (type === "image" || type === "font") {
        this.blockedRequestCount++;
        await route.abort();
      } else {
        await route.continue();
      }
    });
  },
);

Given("I block common analytics scripts", async function (this: PlaywrightWorld) {
  await this.page!.route("**/*google-analytics*/**", (route) => route.abort());
  await this.page!.route("**/*googletagmanager*/**", (route) => route.abort());
  await this.page!.route("**/*facebook.net/**", (route) => route.abort());
});

Given("I block CSS requests at context level", async function (this: PlaywrightWorld) {
  await this.context!.route(/\.css$/i, (route) => route.abort());
});

Given(
  "I block image and CSS requests with the shared mock helper",
  async function (this: PlaywrightWorld) {
    await this.mockHelper!.blockRequests("**/*.{png,jpg,jpeg,gif,svg,webp}");
    await this.mockHelper!.blockRequests("**/*.css");
  },
);

Given(
  "I allow only document, script, XHR, and fetch resources",
  async function (this: PlaywrightWorld) {
    const allowed = new Set(["document", "script", "xhr", "fetch"]);
    await this.page!.route("**/*", async (route) => {
      if (allowed.has(route.request().resourceType())) {
        await route.continue();
      } else {
        this.blockedRequestCount++;
        await route.abort();
      }
    });
  },
);

When("I visit {string}", async function (this: PlaywrightWorld, url: string) {
  await this.page!.goto(url);
});

When(
  "I visit the page in a new context tab at {string}",
  async function (this: PlaywrightWorld, url: string) {
    this.secondaryPage = await this.context!.newPage();
    await this.secondaryPage.goto(url);
    this.page = this.secondaryPage;
  },
);

Then("the page heading should be visible", async function (this: PlaywrightWorld) {
  await expect(this.page!.locator("h1").first()).toBeVisible();
});

Then(
  "at least one image request should have been blocked",
  async function (this: PlaywrightWorld) {
    expect(this.blockedRequestCount).toBeGreaterThan(0);
  },
);

Then(
  "at least one failed-request event should be captured",
  async function (this: PlaywrightWorld) {
    expect(this.failedRequestCount).toBeGreaterThan(0);
  },
);

Given("I replay fruits requests from the saved HAR file", async function (this: PlaywrightWorld) {
  await this.context!.routeFromHAR(
    path.resolve(process.cwd(), "hars", "demo.playwright.dev.har"),
    { url: "**/api/**", notFound: "abort" },
  );
});

When(
  "I record the fruits API to a temporary HAR file",
  async function (this: PlaywrightWorld) {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "cucumber-fruits-har-"));
    const harPath = path.join(tempDir, "fruits.har");
    await this.context!.routeFromHAR(harPath, {
      url: FRUITS_PATTERN,
      update: true,
    });
    const responsePromise = this.page!.waitForResponse(FRUITS_PATTERN);
    await this.page!.goto("./");
    await responsePromise;
    await this.context!.close();
    const har = JSON.parse(await readFile(harPath, "utf8")) as {
      log: { entries: Array<{ request: { url: string } }> };
    };
    this.recordedHarEntryCount = har.log.entries.filter((entry) =>
      entry.request.url.includes("/api/v1/fruits"),
    ).length;
    await rm(tempDir, { recursive: true, force: true });
  },
);

Then(
  "the temporary HAR should contain a fruits request",
  async function (this: PlaywrightWorld) {
    expect(this.recordedHarEntryCount).toBeGreaterThan(0);
  },
);

Then("the mocking demo page should be visible", async function (this: PlaywrightWorld) {
  await expect(this.page!.locator("body")).toBeVisible();
});

When(
  "I wait for a successful fruits response and open the mocking demo",
  async function (this: PlaywrightWorld) {
    const responsePromise = this.page!.waitForResponse(
      (response) =>
        response.url().includes("/api/v1/fruits") && response.status() === 200,
    );
    await this.page!.goto("./");
    this.fruitsResponse = await responsePromise;
  },
);

When(
  "I wait for a fruits response matching the URL glob and open the mocking demo",
  async function (this: PlaywrightWorld) {
    const responsePromise = this.page!.waitForResponse(FRUITS_PATTERN);
    await this.page!.goto("./");
    this.fruitsResponse = await responsePromise;
  },
);

Then(
  "the fruits API response should be successful",
  async function (this: PlaywrightWorld) {
    expect(this.fruitsResponse?.ok()).toBe(true);
  },
);

Then(
  "the fruits API response should contain a JSON array",
  async function (this: PlaywrightWorld) {
    expect(await this.fruitsResponse!.json()).toEqual(expect.any(Array));
  },
);

Then(
  "at least one request and response should be captured",
  async function (this: PlaywrightWorld) {
    expect(this.capturedRequests.length).toBeGreaterThan(0);
    expect(this.capturedResponses.length).toBeGreaterThan(0);
    expect(this.capturedResponses.every(({ status }) => status >= 200 && status < 600)).toBe(true);
  },
);

When("I emit browser console messages for verification", async function (this: PlaywrightWorld) {
  await this.page!.evaluate(() => {
    console.log("CUCUMBER_MOCK_LOG");
    console.warn("CUCUMBER_MOCK_WARNING");
    console.error("CUCUMBER_MOCK_ERROR");
  });
});

Then("the browser console messages should be captured", async function (this: PlaywrightWorld) {
  await expect
    .poll(() => this.browserConsoleLogs.filter(({ text }) => text.startsWith("CUCUMBER_MOCK_")).length)
    .toBe(3);
});

Given(
  "I start collecting requests containing {string} with the shared mock helper",
  async function (this: PlaywrightWorld, fragment: string) {
    this.mockHelper!.collectRequests(fragment);
  },
);

Then(
  "at least one matching API request should be collected",
  async function (this: PlaywrightWorld) {
    const requests = this.mockHelper!.collectRequests("/api/");
    await expect.poll(() => requests.length).toBeGreaterThan(0);
  },
);
