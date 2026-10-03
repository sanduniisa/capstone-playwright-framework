
import { test, expect } from '@playwright/test';

const FRUITS_API_PATTERN = '*/**/api/v1/fruits';

// ---------------------------------------------------------------------------
// Test Suite: Modify Responses (route.fetch + route.fulfill)
//Sends the request to the real server.
//Can modify outgoing headers or other request properties.
//Used in modify-responses.spec.ts.
// ---------------------------------------------------------------------------

test.describe('Modify Real API Responses', () => {
  test('add a custom fruit to the real response', async ({ page }) => {
    await page.route(FRUITS_API_PATTERN, async (route) => {
      // 1. Fetch the REAL response
      const response = await route.fetch();

      // 2. Parse the real JSON - convert the response body to JSON
      const json = await response.json();

      // 3. Add our custom item -modify data before sending it to the browser
      json.push({ name: 'Playwright Passion Fruit', id: 999 });

      // 4. Fulfill with modified data
      await route.fulfill({ response, json });
    });

    await page.goto('./');

    // Our custom fruit should appear alongside real ones
    await expect(page.getByText('Playwright Passion Fruit')).toBeVisible();
  });

  test('replace one fruit name in the real response', async ({ page }) => {
    await page.route(FRUITS_API_PATTERN, async (route) => {
      const response = await route.fetch();
      const json = await response.json();

      // Replace the first fruit's name
      if (json.length > 0) {
        json[0].name = 'Mock-Replaced Fruit';
      }

      await route.fulfill({ response, json });
    });

    await page.goto('./');

    await expect(page.getByText('Mock-Replaced Fruit')).toBeVisible();
  });

  test('limit the number of items in the response', async ({ page }) => {
    await page.route(FRUITS_API_PATTERN, async (route) => {
      const response = await route.fetch();
      const json = await response.json();

      // Only return the first 2 items
      const limited = json.slice(0, 2);

      await route.fulfill({ response, json: limited });
    });

    // Wait for the intercepted request to finish before test teardown.
    const fruitResponsePromise = page.waitForResponse((response) =>
      response.url().endsWith('/api/v1/fruits'),
    );
    await page.goto('./');
    const fruitResponse = await fruitResponsePromise;

    expect(await fruitResponse.json()).toHaveLength(2);
  });

  test('add a response header to the real response', async ({ page }) => {
    await page.route(FRUITS_API_PATTERN, async (route) => {
      const response = await route.fetch();
      const headers = {
        ...response.headers(),
        'x-mock-injected': 'true',
      };

      await route.fulfill({
        response,
        headers,
      });
    });

    const fruitResponsePromise = page.waitForResponse((response) =>
      response.url().endsWith('/api/v1/fruits'),
    );
    await page.goto('./');
    const fruitResponse = await fruitResponsePromise;

    expect(await fruitResponse.headerValue('x-mock-injected')).toBe('true');
  });
});

// ---------------------------------------------------------------------------
// Test Suite: Modify Outgoing Requests (route.continue)
// ---------------------------------------------------------------------------

test.describe('Modify Outgoing Requests', () => {
  test('add a custom header to outgoing API requests', async ({ page }) => {
    let sentHeaders: Record<string, string> | undefined;

    await page.route(FRUITS_API_PATTERN, async (route) => {
      const headers = {
        ...route.request().headers(),
        'x-test-session': 'session-06',
        'x-test-run': new Date().toISOString(),
      };

      sentHeaders = headers;

      await route.continue({ headers });
    });

    const fruitResponsePromise = page.waitForResponse((response) =>
      response.url().endsWith('/api/v1/fruits'),
    );
    await page.goto('./');
    await fruitResponsePromise;

    expect(sentHeaders).toBeDefined();
    expect(sentHeaders!['x-test-session']).toBe('session-06');
  });

  test('remove a request header before forwarding', async ({ page }) => {
    await page.route('**/*', async (route) => {
      const headers = { ...route.request().headers() };
      // Remove user-agent header for demonstration
      delete headers['user-agent'];
      await route.continue({ headers });
    });

    // Page should still load successfully
    await page.goto('./');
    await expect(page.locator('body')).toBeVisible();
  });
});
