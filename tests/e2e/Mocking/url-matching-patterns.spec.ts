import { test, expect } from '@playwright/test';

const FRUITS_GLOB_PATTERN = '*/**/api/v1/fruits';
const FRUITS_REGEX_PATTERN = /\/api\/v1\/fruits$/;

test.describe('URL Matching Patterns', () => {
  test('glob pattern matches the fruits endpoint', async ({ page }) => {
    await page.route(FRUITS_GLOB_PATTERN, async (route) => {
      await route.fulfill({ json: [{ name: 'Glob Fruit', id: 1 }] });
    });
    await page.goto('./');
    await expect(page.getByText('Glob Fruit')).toBeVisible();
  });

  test('regex pattern matches the same endpoint', async ({ page }) => {
    await page.route(FRUITS_REGEX_PATTERN, async (route) => {
      await route.fulfill({ json: [{ name: 'Regex Fruit', id: 2 }] });
    });
    await page.goto('./');
    await expect(page.getByText('Regex Fruit')).toBeVisible();
  });

  test('predicate function matches by pathname', async ({ page }) => {
    await page.route(
      (url) => url.pathname.includes('/api/v1/fruits'),
      async (route) => {
        await route.fulfill({ json: [{ name: 'Predicate Fruit', id: 3 }] });
      },
    );
    await page.goto('./');
    await expect(page.getByText('Predicate Fruit')).toBeVisible();
  });

  test('predicate combined with handler logic to filter by HTTP method', async ({
    page,
  }) => {
    // A URL pattern alone cannot inspect the request method.
    await page.route(
      (url) => url.pathname.endsWith('/api/v1/fruits'),
      async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({ json: [{ name: 'Method Fruit', id: 4 }] });
        } else {
          await route.continue();
        }
      },
    );
    await page.goto('./');
    await expect(page.getByText('Method Fruit')).toBeVisible();
  });

});