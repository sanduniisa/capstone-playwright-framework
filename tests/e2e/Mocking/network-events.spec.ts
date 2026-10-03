

import { test, expect } from '@playwright/test';
import type { TestInfo } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

type BrowserLogEntry = {
  testCaseId: string;
  source: 'console' | 'pageerror';
  type: string;
  text: string;
  timestamp: string;
};

const browserLogsByTest = new WeakMap<TestInfo, BrowserLogEntry[]>();
const getTestCaseId = () =>
  test.info().title.match(/NET-\d{3}/)?.[0] ?? 'NET-UNKNOWN';

// ---------------------------------------------------------------------------
// Test Suite: Network Events & Monitoring
// ---------------------------------------------------------------------------

test.describe('Network Events', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const testCaseId = testInfo.title.match(/NET-\d{3}/)?.[0] ?? 'NET-UNKNOWN';
    const browserLogs: BrowserLogEntry[] = [];
    browserLogsByTest.set(testInfo, browserLogs);
    console.log(`[${testCaseId}] START ${testInfo.title}`);

    // Page-scoped listeners log network activity for each test independently.
    page.on('request', (request) => {
      console.log(`[${testCaseId}] [REQUEST] ${request.method()} ${request.url()}`);
    });

    page.on('response', (response) => {
      console.log(`[${testCaseId}] [RESPONSE] ${response.status()} ${response.url()}`);
    });

    page.on('console', (message) => {
      console.log(`[${testCaseId}] [BROWSER CONSOLE:${message.type()}] ${message.text()}`);
      browserLogs.push({
        testCaseId,
        source: 'console',
        type: message.type(),
        text: message.text(),
        timestamp: new Date().toISOString(),
      });
    });

    // Capture uncaught JavaScript exceptions raised by the page.
    page.on('pageerror', (error) => {
      console.error(`[${testCaseId}] [PAGE ERROR] ${error.message}`);
      browserLogs.push({
        testCaseId,
        source: 'pageerror',
        type: 'error',
        text: error.message,
        timestamp: new Date().toISOString(),
      });
    });
  });

  test.afterEach(async ({}, testInfo) => {
    const testCaseId = testInfo.title.match(/NET-\d{3}/)?.[0] ?? 'NET-UNKNOWN';
    const browserLogs = browserLogsByTest.get(testInfo) ?? [];
    const jsonPath = testInfo.outputPath('browser-console-logs.json');

    await mkdir(path.dirname(jsonPath), { recursive: true });
    await writeFile(
      jsonPath,
      JSON.stringify(
        {
          testCaseId,
          test: testInfo.title,
          entries: browserLogs,
        },
        null,
        2,
      ),
      'utf-8',
    );
  });

  test('[NET-001] capture browser console messages', async ({ page }) => {
    const consoleMessages: { type: string; text: string }[] = [];

    // Subscribe before emitting messages so none are missed.
    page.on('console', (message) => {
      consoleMessages.push({
        type: message.type(),
        text: message.text(),
      });
    });

    await page.evaluate(() => {
      console.log('test console log');
      console.warn('test console warning');
      console.error('test console error');
    });

    expect(consoleMessages).toEqual([
      { type: 'log', text: 'test console log' },
      { type: 'warning', text: 'test console warning' },
      { type: 'error', text: 'test console error' },
    ]);
  });

  test('[NET-002] log all outgoing requests during navigation', async ({ page }) => {
    const requestUrls: string[] = [];

    page.on('request', (request) => {
      requestUrls.push(`${request.method()} ${request.url()}`);
    });

    await page.goto('./');
    console.log(`[${getTestCaseId()}] All outgoing requests during navigation:`);
    console.log(`[${getTestCaseId()}]\n${requestUrls.join('\n')}`);

    // We should have captured at least the document request
    console.log(`[${getTestCaseId()}] Captured ${requestUrls.length} request(s)`);
    expect(requestUrls.length).toBeGreaterThan(0);

    // The main page request should be present
    const hasDocument = requestUrls.some((u) => u.startsWith('GET'));
    expect(hasDocument).toBe(true);
  });

  test('[NET-003] log response status codes', async ({ page }) => {
    const responses: { url: string; status: number }[] = [];

    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        status: response.status(),
      });
    });

    await page.goto('./');

    // All responses should have valid HTTP status codes
    for (const resp of responses) {
      expect(resp.status).toBeGreaterThanOrEqual(200);
      expect(resp.status).toBeLessThan(600);
    }

    console.log(`[${getTestCaseId()}] Received ${responses.length} response(s)`);
  });

  test('[NET-004] detect failed requests', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('requestfailed', (request) => {
      failedRequests.push(
        `${request.url()} – ${request.failure()?.errorText}`,
      );
    });

    // Block images so we create some failed requests
    await page.route('**/*.{png,jpg,svg}', (route) => route.abort());

    await page.goto('./');

    console.log(`[${getTestCaseId()}] Failed requests: ${failedRequests.length}`);
    // Each aborted image becomes a "requestfailed" event
  });

  test('[NET-005] wait for a specific API response', async ({ page }) => {
    // Start waiting BEFORE triggering the action
    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/v1/fruits') && resp.status() === 200,
    );

    // Navigate – this triggers the API call
    await page.goto('./');

    // Await the specific response
    const response = await responsePromise;

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    console.log(`[${getTestCaseId()}] Fruits API returned ${body.length} item(s)`);
  });

  test('[NET-006] wait for response with URL string pattern', async ({ page }) => {
    const responsePromise = page.waitForResponse('*/**/api/v1/fruits');

    await page.goto('./');

    const response = await responsePromise;
    expect(response.ok()).toBe(true);
  });

  test('[NET-007] collect requests using mockHelper fixture', async ({
    page,
  }) => {
    const apiCalls: string[] = [];

    page.on('request', (request) => {
      if (request.url().includes('/api/')) {
        apiCalls.push(request.url());
      }
    });

    const fruitResponsePromise = page.waitForResponse((response) =>
      response.url().includes('/api/v1/fruits'),
    );
    await page.goto('./');
    await fruitResponsePromise;

    // At least one API call should have been made
    expect(apiCalls.length).toBeGreaterThan(0);
    console.log(`[${getTestCaseId()}] API calls:`, apiCalls);
  });
});
